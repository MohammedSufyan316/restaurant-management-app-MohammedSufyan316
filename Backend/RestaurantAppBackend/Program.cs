using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.AspNetCore.Authorization;
using MongoDB.Driver;
using RestaurantAppBackend;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = "GitHub";
})
    .AddCookie()
.AddOAuth("GitHub", options =>
{
    options.ClientId = builder.Configuration["GitHub:ClientId"];
    options.ClientSecret = builder.Configuration["GitHub:ClientSecret"];
    options.CallbackPath = new PathString("/signin-github");

    options.AuthorizationEndpoint = "https://github.com/login/oauth/authorize";
    options.TokenEndpoint = "https://github.com/login/oauth/access_token";
    options.UserInformationEndpoint = "https://api.github.com/user";

    options.ClaimActions.MapJsonKey(ClaimTypes.NameIdentifier, "id");
    options.ClaimActions.MapJsonKey(ClaimTypes.Name, "login");
    options.ClaimActions.MapJsonKey(ClaimTypes.Email, "email");

    options.Scope.Add("user:email");

    options.Events = new OAuthEvents
    {
        OnCreatingTicket = async context =>
        {
            var request = new HttpRequestMessage(HttpMethod.Get, context.Options.UserInformationEndpoint);
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", context.AccessToken);

            var response = await context.Backchannel.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, context.HttpContext.RequestAborted);
            response.EnsureSuccessStatusCode();

            var user = JsonDocument.Parse(await response.Content.ReadAsStringAsync());

            var githubId = user.RootElement.GetProperty("id").GetInt64().ToString();
            var userName = user.RootElement.GetProperty("login").GetString();
            var email = user.RootElement.GetProperty("email").GetString();

            // Save user details to MongoDB if they do not already exist
            var userService = context.HttpContext.RequestServices.GetRequiredService<UserService>();
            var existingUser = await userService.GetUserByIdAsync(githubId);
            if (existingUser == null)
            {
                var newUser = new User
                {
                    Id = githubId,
                    UserName = userName,
                    Email = email
                };
                await userService.CreateUserAsync(newUser);
            }

            context.RunClaimActions(user.RootElement);
        }
    };
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
    policy =>
    {
        policy.WithOrigins("http://localhost:3000")
           .AllowCredentials()
           .AllowAnyMethod()
           .SetIsOriginAllowed((host) => true)
           .AllowAnyHeader();
    });
});

// MongoDB settings from configuration
var mongoSettings = builder.Configuration.GetSection("MongoDbSettings");
var mongoClient = new MongoClient(mongoSettings["ConnectionString"]);
var mongoDatabase = mongoClient.GetDatabase(mongoSettings["DatabaseName"]);

// Register the IMongoDatabase instance
builder.Services.AddSingleton<IMongoDatabase>(mongoDatabase);

// Configure collections 
var menuItemsCollection = mongoDatabase.GetCollection<MenuItem>("MenuItems");
var ordersCollection = mongoDatabase.GetCollection<Order>("Orders");

// Register services before building the app
builder.Services.AddSingleton(menuItemsCollection);
builder.Services.AddSingleton(ordersCollection);

builder.Services.AddSingleton<MenuItemService>();
builder.Services.AddSingleton<OrderService>();
builder.Services.AddScoped<UserService>();

builder.Services.AddAuthorization();

var app = builder.Build();

// Use authentication and authorization middleware
app.UseAuthentication();  // This middleware is responsible for authenticating the user
app.UseAuthorization();   // This middleware is responsible for authorizing the user

// Use CORS
app.UseCors("AllowAllOrigins");

app.UseHttpsRedirection();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapGet("/login", async context =>
{
    await context.ChallengeAsync("GitHub", new AuthenticationProperties
    {
        // This will be where the user is redirected after a successful login
        RedirectUri = "http://localhost:3000/dining"
    });
});

app.MapGet("/logout", async context =>
{
    await context.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
    context.Response.Redirect("/login");
});

app.MapGet("/signin-github", async context =>
{
    var authenticateResult = await context.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);

    if (authenticateResult.Succeeded)
    {
        // Successful authentication
        var userName = authenticateResult.Principal?.Identity?.Name;
        context.Response.Redirect("http://localhost:3000/dining"); // Redirect to a profile or dashboard page
    }
    else
    {
        // Authentication failed, redirect back to login page
        context.Response.Redirect("http://localhost:3000/login");
    }
});

app.MapGet("/profile", async (HttpContext context) =>
{
    var user = context.User;
    if (user.Identity?.IsAuthenticated == true)
    {
        var githubId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userService = context.RequestServices.GetRequiredService<UserService>();
        var userProfile = await userService.GetUserByIdAsync(githubId);
        if (userProfile != null)
        {
            context.Response.Redirect("http://localhost:3000/dining");
            return Results.Ok();
        }
        else
        {
            return Results.Redirect("/login");
        }
    }
    else
    {
        return Results.Redirect("/login");
    }
});


app.MapGet("/api/menu", async (MenuItemService menuItemService) =>
{
    return await menuItemService.GetAllItems();
});

app.MapGet("/api/menu/{id}", async (string id, MenuItemService menuItemService) =>
{
    var menuItem = await menuItemService.GetItemById(id);
    return menuItem is not null ? Results.Ok(menuItem) : Results.NotFound();
});

app.MapPost("/api/menu", async (MenuItem menuItem, MenuItemService menuItemService) =>
{
    await menuItemService.CreateItem(menuItem);
    return Results.Created($"/api/menu/{menuItem.Id}", menuItem);
});

app.MapPut("/api/menu/{id}", async (string id, MenuItem menuItem, MenuItemService menuItemService) =>
{
    var updated = await menuItemService.UpdateItem(id, menuItem);
    return updated ? Results.NoContent() : Results.NotFound();
});

app.MapDelete("/api/menu/{id}", async (string id, MenuItemService menuItemService) =>
{
    var deleted = await menuItemService.DeleteItem(id);
    return deleted ? Results.NoContent() : Results.NotFound();
});

app.MapGet("/api/orders", async (OrderService orderService) =>
    await orderService.GetAllOrders());

app.MapGet("/api/orders/{id}", async (string id, OrderService orderService) =>
{
    var order = await orderService.GetOrderById(id);
    return order is not null ? Results.Ok(order) : Results.NotFound();
});

app.MapPost("/api/orders", async (Order order, OrderService orderService) =>
{
    await orderService.CreateOrder(order);
    return Results.Created($"/api/orders/{order.Id}", order);
});

app.MapPut("/api/orders/{id}", async (string id, Order updatedOrder, OrderService orderService) =>
{
    var updated = await orderService.UpdateOrder(id, updatedOrder);
    return updated ? Results.NoContent() : Results.NotFound();
});

app.MapDelete("/api/orders/{id}", async (string id, OrderService orderService) =>
{
    var deleted = await orderService.DeleteOrder(id);
    return deleted ? Results.NoContent() : Results.NotFound();
});

app.MapGet("/api/orders/table/{tableNumber}", async (int tableNumber, OrderService orderService) =>
{
    var order = await orderService.GetPendingOrderByTableNumber(tableNumber);
    return order is not null ? Results.Ok(order) : Results.NotFound();
});

app.Run();

