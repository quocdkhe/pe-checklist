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
                <span>Lưu ý: [EnableQuery] tự động xử lý $filter, $top, $skip từ URL</span>
              </task-container>
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
