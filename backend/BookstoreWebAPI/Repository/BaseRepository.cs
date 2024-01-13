using System.ComponentModel;

namespace BookstoreWebAPI.Repository
{
    public abstract class BaseRepository
    {
        protected readonly IConfiguration _configuration;
        protected readonly ILogger<BaseRepository> _logger;

        public BaseRepository(
            IConfiguration configuration,
            ILogger<BaseRepository> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }
    }
}
