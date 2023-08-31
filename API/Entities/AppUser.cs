using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace API.Entities;

public class AppUser
{
   
    public int Id { get; set; }
    public string UserName { get; set; }

}
