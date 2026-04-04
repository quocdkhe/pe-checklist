<template>
  <v-container>
    <v-row justify="center" class="w-100">
      <v-col cols="12">
        <h3>Cấu hình Odata: </h3>

        <v-sheet border="thin" class="mt-4">
          <v-table>
            <thead>
              <tr>
                <th class="text-center font-weight-bold">Đầu việc</th>
                <th class="font-weight-bold done-column">Done ?</th>
              </tr>
            </thead>
            <tbody>
              <task-container>
                <span>Cấu hình Program.cs:</span>
                <Code :text="odataProgramConfig" language="csharp"></Code>
              </task-container>
              
              <task-container>
                <span>Cấu hình Controller (Select DTO, EnableQuery, IQueryable):</span>
                <Code :text="odataControllerConfig" language="csharp"></Code>
              </task-container>

              <task-container>
                <span>Lưu ý: <code>[EnableQuery]</code> tự động xử lý $filter, $top, $skip từ URL</span>
              </task-container>
            </tbody>
          </v-table>
        </v-sheet>

        <h3 class="mt-8 mb-4">Các tham số Query String phổ biến:</h3>
        <v-sheet border="thin">
          <v-table>
            <thead>
              <tr>
                <th class="font-weight-bold" style="width: 200px">Tham số</th>
                <th class="font-weight-bold">Ý nghĩa & Ví dụ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>$filter</code></td>
                <td>
                  Lọc dữ liệu theo điều kiện.<br/>
                  <code class="text-primary">? $filter=Name eq 'John'</code> (Bằng)<br/>
                  <code class="text-primary">? $filter=Price gt 100</code> (Lớn hơn - Greater Than)<br/>
                  <code class="text-primary">? $filter=contains(Name, 'A')</code> (Chứa chuỗi)
                </td>
              </tr>
              <tr>
                <td><code>$select</code></td>
                <td>
                  Chỉ lấy các trường cụ thể (giảm tải payload).<br/>
                  <code class="text-primary">? $select=OrderId,OrderDate</code>
                </td>
              </tr>
              <tr>
                <td><code>$orderby</code></td>
                <td>
                  Sắp xếp dữ liệu.<br/>
                  <code class="text-primary">? $orderby=OrderDate desc</code> (Giảm dần)<br/>
                  <code class="text-primary">? $orderby=Name asc</code> (Tăng dần)
                </td>
              </tr>
              <tr>
                <td><code>$expand</code></td>
                <td>
                  Lấy kèm các bảng liên quan (giống Include trong EF).<br/>
                  <code class="text-primary">? $expand=Customer,OrderDetails</code>
                </td>
              </tr>
              <tr>
                <td><code>$top</code> & <code>$skip</code></td>
                <td>
                  Dùng để phân trang.<br/>
                  <code class="text-primary">? $top=10&$skip=20</code> (Lấy 10 dòng, bỏ qua 20 dòng đầu)
                </td>
              </tr>
              <tr>
                <td><code>$count</code></td>
                <td>
                  Trả về tổng số bản ghi.<br/>
                  <code class="text-primary">? $count=true</code>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import Code from '@/components/Code.vue'
import TaskContainer from '@/components/TaskContainer.vue';

const odataProgramConfig = `builder.Services.AddControllers()
    .AddOData(options =>
        options.Select()
                .Filter()
                .OrderBy()
                .SkipToken()
                .SetMaxTop(100)
                .Count()
    );`;

const odataControllerConfig = `[HttpGet("orders")]
[EnableQuery]
//public ActionResult<IQueryable<OrderDto>> GetOrders()
public IActionResult GetOrders()
{
    // 1. Chỉ định nghĩa Query, CHƯA thực thi xuống DB
    var query = _context.Orders.Select(o => new OrderDto
    {
        OrderId = o.OrderId,
        OrderDate = o.OrderDate!.Value,
        Customer = new OrderDto.CustomerDto
        {
            CustomerId = o.Customer.CustomerId,
            FullName = o.Customer.FullName
        }
    });

    // 2. Kiểm tra xem có dữ liệu không (EF sẽ sinh ra SQL: SELECT TOP 1 1 FROM Orders)
    // Lệnh này rất nhẹ vì DB chỉ tìm 1 dòng là dừng.
    if (!query.Any())
    {
        return NoContent(); // Trả về 204
    }

    // 3. Trả về IQueryable (Chưa ToList)
    // [EnableQuery] sẽ lấy các tham số $filter, $top, $skip từ URL 
    // và "gắn" thêm vào biến \`query\` này trước khi gửi SQL cuối cùng xuống DB.
    return Ok(query);
}`;
</script>

<style scoped>
.done-column {
  width: 120px;
}
</style>
