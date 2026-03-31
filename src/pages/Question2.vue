<template>
  <v-container class="fill-height d-flex flex-column justify-center">
    <v-row justify="center">
      <v-col cols="12">
        <h3>Checklist câu 2: </h3>

        <v-row>
          <v-col cols="12">
            <v-text-field v-model="fbtUsername" label="username fbt (phần trước @fpt.edu.vn)" required></v-text-field>
          </v-col>
        </v-row>
        <v-sheet border="thin">
          <v-table>
            <thead>
              <tr>
                <th class="text-center font-weight-bold">Đầu việc</th>
                <th class="font-weight-bold done-column">Done ?</th>
              </tr>
            </thead>
            <tbody>
              <task-container>
                <span>Cấu hình razor page</span>
                <Code :text="razorPageConfig"></Code>
              </task-container>
              <task-container>
                <span>Tạo folder services, thêm file ApiClientService</span>
                <Code :text="apiClientServiceCode"></Code>
              </task-container>
              <task-container>
                <span>Register service</span>
                <Code :text="registerService"></Code>
              </task-container>
              <task-container>
                <span>Làm xong câu 2, publish bài:</span>
                <Code :text="publishCmd"></Code>
              </task-container>
              <task-container>
                <span>Xóa bin, xóa obj, done câu 2</span>
              </task-container>
            </tbody>
          </v-table>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Code from '@/components/Code.vue'
import TaskContainer from '@/components/TaskContainer.vue';


const fbtUsername = ref<string>('quocdkhe')

const razorPageConfig = `namespace Question2
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddRazorPages();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthorization();

            app.MapRazorPages();

            app.Run();

        }
    }
}
`

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

        /// <summary>
        /// Fetches generic data from the API via a GET request
        /// </summary>
        /// <typeparam name="T">The type of object to deserialize into</typeparam>
        /// <param name="endpoint">The specific endpoint (e.g., "api/users")</param>
        /// <returns>Object of type T or default value if an error occurs</returns>
        public async Task<T?> FetchDataAsync<T>(string endpoint)
        {
            try
            {
                var response = await _httpClient.GetAsync(endpoint);
                response.EnsureSuccessStatusCode();

                using var content = await response.Content.ReadAsStreamAsync();

                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };

                return await JsonSerializer.DeserializeAsync<T>(content, options);
            }
            catch (HttpRequestException httpEx)
            {
                _logger.LogError(httpEx, "HTTP error calling API at {Endpoint}. Status Code: {StatusCode}", endpoint, httpEx.StatusCode);
                return default;
            }
            catch (JsonException jsonEx)
            {
                _logger.LogError(jsonEx, "JSON parsing error from API at {Endpoint}", endpoint);
                return default;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred while calling API: {Endpoint}", endpoint);
                return default;
            }
        }

        /// <summary>
        /// Sends a payload to the API via a POST request and returns the deserialized response
        /// </summary>
        /// <typeparam name="TRequest">The type of the payload to send</typeparam>
        /// <typeparam name="TResponse">The type of the response to deserialize into</typeparam>
        /// <param name="endpoint">The specific endpoint (e.g., "api/users")</param>
        /// <param name="payload">The object to serialize and send as the request body</param>
        /// <returns>Deserialized response of type TResponse, or default if an error occurs</returns>
        public async Task<TResponse?> PostDataAsync<TRequest, TResponse>(string endpoint, TRequest payload)
        {
            try
            {
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };

                // Serialize the payload to JSON and wrap it in StringContent
                var jsonPayload = JsonSerializer.Serialize(payload, options);
                using var requestContent = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

                // Send POST request with the serialized payload
                var response = await _httpClient.PostAsync(endpoint, requestContent);

                // Throws an exception if the HTTP response status is an error code
                response.EnsureSuccessStatusCode();

                // Read and deserialize the response body
                using var responseStream = await response.Content.ReadAsStreamAsync();
                return await JsonSerializer.DeserializeAsync<TResponse>(responseStream, options);
            }
            catch (HttpRequestException httpEx)
            {
                _logger.LogError(httpEx, "HTTP error during POST at {Endpoint}. Status Code: {StatusCode}", endpoint, httpEx.StatusCode);
                return default;
            }
            catch (JsonException jsonEx)
            {
                _logger.LogError(jsonEx, "JSON error during POST at {Endpoint}", endpoint);
                return default;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error during POST at {Endpoint}", endpoint);
                return default;
            }
        }

        /// <summary>
        /// Sends a partial payload to the API via a PATCH request and returns the deserialized response
        /// </summary>
        /// <typeparam name="TRequest">The type of the partial payload to send</typeparam>
        /// <typeparam name="TResponse">The type of the response to deserialize into</typeparam>
        /// <param name="endpoint">The specific endpoint (e.g., "api/users/1")</param>
        /// <param name="payload">The partial object to serialize and send as the request body</param>
        /// <returns>Deserialized response of type TResponse, or default if an error occurs</returns>
        public async Task<TResponse?> PatchDataAsync<TRequest, TResponse>(string endpoint, TRequest payload)
        {
            try
            {
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };

                // Serialize the partial payload to JSON
                var jsonPayload = JsonSerializer.Serialize(payload, options);
                using var requestContent = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

                // Build and send PATCH request (HttpClient has no built-in PatchAsync shorthand pre-.NET 5)
                var request = new HttpRequestMessage(HttpMethod.Patch, endpoint)
                {
                    Content = requestContent
                };

                var response = await _httpClient.SendAsync(request);

                // Throws an exception if the HTTP response status is an error code
                response.EnsureSuccessStatusCode();

                // Read and deserialize the response body
                using var responseStream = await response.Content.ReadAsStreamAsync();
                return await JsonSerializer.DeserializeAsync<TResponse>(responseStream, options);
            }
            catch (HttpRequestException httpEx)
            {
                _logger.LogError(httpEx, "HTTP error during PATCH at {Endpoint}. Status Code: {StatusCode}", endpoint, httpEx.StatusCode);
                return default;
            }
            catch (JsonException jsonEx)
            {
                _logger.LogError(jsonEx, "JSON error during PATCH at {Endpoint}", endpoint);
                return default;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error during PATCH at {Endpoint}", endpoint);
                return default;
            }
        }

        /// <summary>
        /// Consumes a DELETE API endpoint
        /// </summary>
        /// <param name="endpoint">The specific endpoint (e.g., "api/users/1")</param>
        /// <returns>True if the deletion was successful (2xx), false otherwise</returns>
        public async Task<bool> DeleteDataAsync(string endpoint)
        {
            try
            {
                var response = await _httpClient.DeleteAsync(endpoint);

                if (response.IsSuccessStatusCode)
                {
                    _logger.LogInformation("Successfully deleted resource at {Endpoint}", endpoint);
                    return true;
                }

                _logger.LogWarning("Failed to delete resource at {Endpoint}. Status Code: {StatusCode}", endpoint, response.StatusCode);
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting data at {Endpoint}", endpoint);
                return false;
            }
        }
    }
}`

const registerService = `builder.Services.AddHttpClient<ApiClientService>();`

const publishCmd = computed(() => `dotnet publish -c release -o ./Q2_${fbtUsername.value}`)

</script>

<style scoped>
.done-column {
  width: 120px;
}
</style>
