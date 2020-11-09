using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using API.Models;
using DAL;
using EF.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using VM;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    [EnableCors("AllowOrigin")]
    [AllowAnonymous]
    public class FileUploadsController : ControllerBase
    {
        private readonly IHttpClientFactory _clientFactory;
        private IHostingEnvironment hostEnvironment;

        public FileUploadsController(IHttpClientFactory clientFactory, IHostingEnvironment environment)
        {
            _clientFactory = clientFactory;
            hostEnvironment = environment;
        }

        [HttpGet, HttpPost]
        public async Task<string> Create()
        {
            try
            {
                string tbLogo = "";
                if (Request.HasFormContentType)
                {
                    var form = Request.Form;
                    foreach (var file in form.Files)
                    {
                        if (file == null)// happens only when no imges are added
                        {
                            tbLogo = null;
                            continue; // will go to next iteration which is not found by default (so it exit)
                        }
                        var filename = DateTime.Now.ToString("ddMMyyyyssmmHH") + Path.GetExtension(file.FileName);
                        //string pic = System.IO.Path.GetFileName(filename);
                        string path = Path.Combine(hostEnvironment.WebRootPath, "Areas", filename);
                        using (var stream = new FileStream(path, FileMode.Create))
                        {
                            await file.CopyToAsync(stream);
                        }

                        string purebaseuri = $"https://{this.Request.Host}{this.Request.PathBase}";
                        tbLogo = purebaseuri + "/Areas/" + filename;
                        break;
                    }
                }
                return tbLogo;
            }
            catch (Exception ex)
            {
                return "";
            }
        }


    }
}
