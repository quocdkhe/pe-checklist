<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12">
        <h3>Checklist câu 1: </h3>

        <v-row>
          <v-col cols="12" md="4">
            <v-text-field v-model="dbName" label="Tên database" required></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field v-model="sqlPassword" label="Mật khẩu sql server" required></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
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
                <span>Lệnh scaffold:</span>
                <Code :text="scaffoldCmd"></Code>
              </task-container>
              <task-container>
                <span>Định nghĩa appsettings.json:</span>
                <Code :text="appsettingCmd"></Code>
              </task-container>
              <task-container>
                <span>Đổi file appsettings.json sang copy always</span>
              </task-container>
              <task-container>
                <span>Lưu ý quan trọng: Xóa connection string trong file DbContext</span>
              </task-container>
              <task-container>
                <span>Cấu hình Program.cs phần database: </span>
                <Code :text="databaseCmd"></Code>
              </task-container>
              <task-container>
                <span>Cấu hình Cors, phần builder </span>
                <Code :text="corsCmdBuilder"></Code>
              </task-container>
              <task-container>
                <span>phần dưới app.run()</span>
                <Code :text="corsCmdUse"></Code>
              </task-container>
              <task-container>
                <span>Sửa launch Settings sang port theo đề bài, thường là 5000</span>
              </task-container>
              <task-container>
                <span>Làm xong câu 1, publish bài:</span>
                <Code :text="publishCmd"></Code>
              </task-container>
              <task-container>
                <span>Xóa bin, xóa obj, done câu 1</span>
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
import toContextName from '@/utils/nameConverter';

// state
const dbName = ref<string>('PE_PRN_Fall22B1')
const sqlPassword = ref<string>('123')
const fbtUsername = ref<string>('quocdkhe')


// computed
const scaffoldCmd = computed(() => `dotnet ef dbcontext scaffold "server=(local);database=${dbName.value};uid=sa;pwd=${sqlPassword.value};TrustServerCertificate=True;Encrypt=False" Microsoft.EntityFrameworkCore.SqlServer -o Models`);
const appsettingCmd = computed(() => `"ConnectionStrings": {
  "MyCnn": "server =(local); database = ${dbName.value};uid=sa;pwd=${sqlPassword.value}; Integrated security = True; TrustServerCertificate=True;"
}`)
const databaseCmd = computed(() => `builder.Services.AddDbContext<${toContextName(dbName.value)}>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("MyCnn")));
builder.Services.AddScoped<${toContextName(dbName.value)}>();`)
const corsCmdBuilder = `builder.Services.AddCors(opts =>
{
    opts.AddPolicy("CORSPolicy", builder => builder.AllowAnyHeader().AllowAnyMethod().AllowCredentials().SetIsOriginAllowed((host) => true));
});`
const corsCmdUse = `app.UseCors("CORSPolicy");`
const publishCmd = computed(() => `dotnet publish -c release -o ./Q1_${fbtUsername.value}`)

</script>

<style scoped>
.done-column {
  width: 120px;
}
</style>
