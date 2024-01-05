
using System.Text;
using API.Data;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using API.Middleware;
using API.Services;
using API.SignalR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);
// midleware for Authentication 


var app = builder.Build();

// if(builder.Environment.IsDevelopment()){
//     app.UseDeveloperExceptionPage();
// }

app.UseMiddleware<ExceptionMiddleware>();

// Configure the HTTP request pipeline.
app.UseCors(builder=> builder
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials()// require for signalR
    .WithOrigins("http://localhost:4200"));

app.UseAuthentication();// Check token
app.UseAuthorization();// check the token is valid?
app.MapControllers();
app.MapHub<PresenceHub>("hubs/presence");
app.MapHub<MessageHub>("hubs/message");

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try{
    var context = services.GetRequiredService<DataContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    var roleManager = services.GetRequiredService<RoleManager<AppRole>>();
    await context.Database.MigrateAsync();
    //context.Connections.RemoveRange(context.Connections);// remove hub connedctions when restart
    //or
    await context.Database.ExecuteSqlRawAsync("TRUNCATE TABLE [Connections]");
    //await context.Database.ExecuteSqlRawAsync("DELETE FROM [Connections]");// for SQL lite
    await Seed.SeedUsers(userManager,roleManager);
}
catch(Exception ex){
    var logger = services.GetService<ILogger<Program>>();
    logger.LogError(ex, "An error occoured during migration");
}

app.Run();
