<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12">
        <h2 class="mb-4">Công thức Phân trang (Pagination)</h2>
        
        <v-alert type="info" variant="tonal" class="mb-6">
          Phân trang giúp giảm tải cho Server và DB khi trả về danh sách dữ liệu lớn. Công thức chuẩn thường dùng `Skip` và `Take`.
        </v-alert>

        <v-expansion-panels multiple>
          <!-- Formula Summary -->
          <v-expansion-panel>
            <v-expansion-panel-title class="text-primary font-weight-bold">
              1. Công thức toán học & Logic
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <div class="mb-4">
                <p class="font-weight-bold mb-2">Các tham số cần thiết:</p>
                <ul>
                  <li><strong>PageNumber (n):</strong> Số thứ tự trang hiện tại (bắt đầu từ 1).</li>
                  <li><strong>PageSize (s):</strong> Số lượng record trên mỗi trang (ví dụ: 10, 20).</li>
                </ul>
              </div>

              <div class="mb-4">
                <p class="font-weight-bold mb-2">Công thức tính toán:</p>
                <Code :text="paginationLogic" class="mt-2"></Code>
              </div>

              <div>
                <p class="font-weight-bold mb-2">Tính tổng số trang (TotalPages):</p>
                <Code text="int totalPages = (int)Math.Ceiling((double)totalCount / pageSize);"></Code>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!-- Controller Example -->
          <v-expansion-panel>
            <v-expansion-panel-title class="text-success font-weight-bold">
              2. Code mẫu Controller (ASP.NET Core)
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <p class="mb-4">Ví dụ API get danh sách Book với phân trang:</p>
              <Code :text="paginationControllerCode"></Code>
              
              <v-alert type="warning" icon="mdi-alert" variant="text" class="mt-4 density-compact">
                Luôn gọi <code>.OrderBy()</code> trước khi <code>.Skip()</code> để đảm bảo thứ tự dữ liệu không bị đảo lộn giữa các trang.
              </v-alert>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import Code from '@/components/Code.vue'

const paginationLogic = `// Số bản ghi cần bỏ qua
int skipCount = (pageNumber - 1) * pageSize;

// Lấy dữ liệu từ DB
var data = await _context.Entities
    .OrderBy(e => e.Id)      // 1. Phải OrderBy trước
    .Skip(skipCount)         // 2. Bỏ qua các trang trước
    .Take(pageSize)          // 3. Lấy đúng số lượng trang này
    .ToListAsync();`;

const paginationControllerCode = `[HttpGet]
public async Task<IActionResult> GetAll(int pageNumber = 1, int pageSize = 10)
{
    // 0. Đảm bảo tham số hợp lệ
    if (pageNumber < 1) pageNumber = 1;
    if (pageSize < 1) pageSize = 10;

    // 1. Tính tổng số bản ghi (để Client hiển thị phân trang)
    var totalCount = await _context.Books.CountAsync();

    // 2. Lấy dữ liệu trang hiện tại
    var data = await _context.Books
        .OrderBy(b => b.Title)
        .Skip((pageNumber - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync();

    // 3. Trả về kèm Metadata (Tùy chọn)
    return Ok(new {
        TotalCount = totalCount,
        PageNumber = pageNumber,
        PageSize = pageSize,
        Data = data
    });
}`;
</script>

<style scoped>
ul {
  padding-left: 20px;
}
li {
  margin-bottom: 4px;
}
</style>
