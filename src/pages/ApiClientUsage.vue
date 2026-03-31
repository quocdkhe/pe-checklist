<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12">
        <h2 class="mb-4">Cách sử dụng ApiClientService</h2>
        
        <v-alert type="info" variant="tonal" class="mb-6">
          <code>ApiClientService</code> là một wrapper quanh <code>HttpClient</code> để đơn giản hóa việc gọi Generic API trong Razor Pages hoặc Controllers.
        </v-alert>

        <v-expansion-panels multiple>
          <!-- The Service Source Code -->
          <v-expansion-panel>
            <v-expansion-panel-title class="text-primary font-weight-bold">
              1. Mã nguồn ApiClientService.cs
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <p class="mb-4">File này thường được đặt trong thư mục <code>Services/</code>.</p>
              <Code :text="apiClientServiceCode"></Code>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!-- Usage Example -->
          <v-expansion-panel>
            <v-expansion-panel-title class="text-success font-weight-bold">
              2. Cách sử dụng trong Razor Page (Index.cshtml.cs)
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <p class="mb-4">Ví dụ sử dụng để Load danh sách Directors, Movies và xử lý Xóa Movie:</p>
              <Code :text="usageCode"></Code>
              
              <div class="mt-4">
                <p class="font-weight-bold">Giải thích các bước:</p>
                <ol class="ml-4">
                  <li><strong>Dependency Injection:</strong> Inject <code>ApiClientService</code> thông qua Constructor.</li>
                  <li><strong>FetchDataAsync:</strong> Tự động Deserialized JSON trả về từ API thành Object tương ứng (List, v.v).</li>
                  <li><strong>DeleteDataAsync:</strong> Gửi yêu cầu DELETE đến API endpoint.</li>
                  <li><strong>Async/Await:</strong> Luôn sử dụng <code>Task OnGetAsync</code> để không block main thread.</li>
                </ol>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import Code from '@/components/Code.vue'

const apiClientServiceCode = `using System.Text;
using System.Text.Json;

namespace Question2.Services
{
    public class ApiClientService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<ApiClientService> _logger;

        public ApiClientService(HttpClient httpClient, IConfiguration configuration, ILogger<ApiClientService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;

            var baseUrl = configuration["GivenAPIBaseUrl"];
            if (string.IsNullOrEmpty(baseUrl))
            {
                throw new ArgumentNullException(nameof(baseUrl), "BaseUrl was not found in appsettings.json");
            }

            _httpClient.BaseAddress = new Uri(baseUrl);
        }

        public async Task<T?> FetchDataAsync<T>(string endpoint)
        {
            try
            {
                var response = await _httpClient.GetAsync(endpoint);
                response.EnsureSuccessStatusCode();
                using var content = await response.Content.ReadAsStreamAsync();
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                return await JsonSerializer.DeserializeAsync<T>(content, options);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calling API at {Endpoint}", endpoint);
                return default;
            }
        }

        public async Task<TResponse?> PostDataAsync<TRequest, TResponse>(string endpoint, TRequest payload)
        {
            try
            {
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var jsonPayload = JsonSerializer.Serialize(payload, options);
                using var requestContent = new StringContent(jsonPayload, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(endpoint, requestContent);
                response.EnsureSuccessStatusCode();
                using var responseStream = await response.Content.ReadAsStreamAsync();
                return await JsonSerializer.DeserializeAsync<TResponse>(responseStream, options);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during POST at {Endpoint}", endpoint);
                return default;
            }
        }

        public async Task<bool> DeleteDataAsync(string endpoint)
        {
            try
            {
                var response = await _httpClient.DeleteAsync(endpoint);
                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while deleting data at {Endpoint}", endpoint);
                return false;
            }
        }
    }
}`;

const usageCode = `using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Question2.Models;
using Question2.Services;

namespace Question2.Pages.Movies.Director_Movie
{
    public class IndexModel : PageModel
    {
        [BindProperty(SupportsGet = true)]
        public string? DirectorId { get; set; } = string.Empty;

        [BindProperty(SupportsGet = true)]
        public string? DeleteMovieId { get; set; }

        public List<Director> Directors { get; set; } = new List<Director>();
        public List<Movie> Movies { get; set; } = new List<Movie>();
        private readonly ApiClientService _apiClientService;

        public IndexModel(ApiClientService apiClientService)
        {
            _apiClientService = apiClientService;
        }

        public async Task OnGetAsync()
        {
            // 1. Load danh sách Directors
            Directors = await _apiClientService.FetchDataAsync<List<Director>>("api/Directors/GetDirectors") ?? new List<Director>();
            
            // 2. Xử lý xóa nếu có DeleteMovieId (Thường là khi click nút Delete kèm ?DeleteMovieId=...)
            if (!string.IsNullOrEmpty(DeleteMovieId))
            {
                await _apiClientService.DeleteDataAsync($"api/Movies/DeleteMovie/{DeleteMovieId}");
            }
            
            // 3. Load danh sách Movies (theo Director hoặc toàn bộ)
            if (!string.IsNullOrEmpty(DirectorId))
            {
                Movies = await _apiClientService.FetchDataAsync<List<Movie>>($"api/Movies/GetMoviesByDirectorId/{DirectorId}") ?? new List<Movie>();
            }
            else
            {
                Movies = await _apiClientService.FetchDataAsync<List<Movie>>("api/Movies/GetMovies") ?? new List<Movie>();
            }
        }
    }
}`;
</script>

<style scoped>
.ml-4 {
  margin-left: 24px;
}
</style>
