<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12">
        <h2 class="mb-4">Hướng dẫn Binding trong Razor Pages (C#)</h2>
        
        <v-alert type="info" variant="tonal" class="mb-6">
          <p>Trong Razor Pages, chúng ta sử dụng thuộc tính <code>[BindProperty]</code> để liên kết dữ liệu giữa Form (HTML) và Code-behind (PageModel).</p>
          <p class="mt-2 font-weight-bold italic text-error">Lưu ý: Phải có <code>@addTagHelper</code> và <code>@Html.AntiForgeryToken()</code> để form hoạt động.</p>
        </v-alert>

        <v-expansion-panels multiple>
          <!-- 0. Lưu ý bắt buộc -->
          <v-expansion-panel>
            <v-expansion-panel-title class="text-error font-weight-bold">
              0. Cấu hình bắt buộc (Tag Helpers & Security)
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <p class="mb-4">Để sử dụng được các <code>asp-for</code> và submit form thành công, bạn CẦN có các dòng sau:</p>
              
              <p class="text-subtitle-2 ml-1 text-grey">_ViewImports.cshtml (hoặc đầu file .cshtml)</p>
              <Code text="@addTagHelper *, Microsoft.AspNetCore.Mvc.TagHelpers" language="html" class="mb-4"></Code>

              <p class="text-subtitle-2 ml-1 text-grey">Bên trong thẻ &lt;form&gt;</p>
              <Code text="@Html.AntiForgeryToken()" language="html"></Code>
              
              <v-alert type="warning" density="compact" variant="tonal" class="mt-4">
                Nếu thiếu <code>@addTagHelper</code>, các thuộc tính <code>asp-for</code> sẽ bị trình duyệt coi là attribute thường và không có tác dụng binding. Nếu thiếu <code>AntiForgeryToken</code>, bạn sẽ gặp lỗi <strong>400 Bad Request</strong> khi submit.
              </v-alert>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!-- 1. Cơ bản về BindProperty -->
          <v-expansion-panel>
            <v-expansion-panel-title class="text-primary font-weight-bold">
              1. Khai báo và Binding cơ bản
              </v-expansion-panel-title>
            <v-expansion-panel-text>
              <p class="mb-4">Sử dụng <code>[BindProperty]</code> để tự động ánh xạ dữ liệu từ Request (POST) vào biến.</p>
              
              <p class="text-subtitle-2 ml-1 text-grey">CSHTML.CS (Code behind)</p>
              <Code :text="basicBindingCS" language="csharp" class="mb-4"></Code>

              <p class="text-subtitle-2 ml-1 text-grey">CSHTML (View)</p>
              <Code :text="basicBindingHTML" language="html"></Code>

              <div class="mt-4">
                <p class="font-weight-bold">Giải thích:</p>
                <ul class="ml-4">
                  <li><code>asp-for</code>: Liên kết thẻ HTML với thuộc tính trong Model. Nó tự động tạo <code>name</code> và <code>id</code>.</li>
                  <li><code>[BindProperty]</code>: Mặc định chỉ bind cho các request POST. Nếu muốn bind cho GET, dùng <code>(SupportsGet = true)</code>.</li>
                </ul>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!-- 2. Binding Radio, Checkbox, Select -->
          <v-expansion-panel>
            <v-expansion-panel-title class="text-success font-weight-bold">
              2. Binding Radio, Checkbox và Select (Dropdown)
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <p class="mb-4">Cách binding các loại input chọn lựa:</p>
              
              <p class="text-subtitle-2 ml-1 text-grey">CSHTML.CS</p>
              <Code :text="selectionBindingCS" language="csharp" class="mb-4"></Code>

              <p class="text-subtitle-2 ml-1 text-grey">CSHTML</p>
              <Code :text="selectionBindingHTML" language="html"></Code>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!-- 3. Binding Checkbox List (Nhiều lựa chọn) -->
          <v-expansion-panel>
            <v-expansion-panel-title class="text-info font-weight-bold">
              3. Binding Checkbox List (Chọn nhiều giá trị vào List)
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <p class="mb-4">Khi bạn có một danh sách các lựa chọn và người dùng có thể chọn nhiều (ví dụ: chọn sở thích, chọn môn học), bạn có thể bind trực tiếp vào một <code>List&lt;string&gt;</code> hoặc <code>List&lt;int&gt;</code>.</p>
              
              <p class="text-subtitle-2 ml-1 text-grey">CSHTML.CS</p>
              <Code :text="checkboxListBindingCS" language="csharp" class="mb-4"></Code>

              <p class="text-subtitle-2 ml-1 text-grey">CSHTML</p>
              <Code :text="checkboxListBindingHTML" language="html"></Code>

              <div class="mt-4">
                <p class="font-weight-bold">Lưu ý cực kỳ quan trọng:</p>
                <ul class="ml-4">
                  <li>Tất cả các checkbox phải có cùng thuộc tính <code>name</code> (trùng với tên biến trong code-behind).</li>
                  <li>Sử dụng thuộc tính <code>value</code> để định nghĩa giá trị sẽ được add vào List khi checkbox đó được tích.</li>
                  <li>Trong code-behind, biến List phải có <code>[BindProperty]</code>.</li>
                </ul>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!-- 4. Binding với Model phức tạp (Object) -->
          <v-expansion-panel>
            <v-expansion-panel-title class="text-warning font-weight-bold">
              4. Binding với Model phức tạp (Object)
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <p class="mb-4">Thay vì bind từng biến lẻ, ta nên gom vào một class Model:</p>
              
              <p class="text-subtitle-2 ml-1 text-grey">CSHTML.CS</p>
              <Code :text="modelBindingCS" language="csharp" class="mb-4"></Code>

              <p class="text-subtitle-2 ml-1 text-grey">CSHTML</p>
              <Code :text="modelBindingHTML" language="html"></Code>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!-- 5. Binding với Danh sách (List) -->
          <v-expansion-panel>
            <v-expansion-panel-title class="text-error font-weight-bold">
              5. Binding với Danh sách (List&lt;T&gt;)
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <p class="mb-4">Quan trọng khi làm các bài thi (PE) có phần nhập danh sách hoặc chỉnh sửa hàng loạt:</p>
              
              <p class="text-subtitle-2 ml-1 text-grey">CSHTML.CS</p>
              <Code :text="listBindingCS" language="csharp" class="mb-4"></Code>

              <p class="text-subtitle-2 ml-1 text-grey">CSHTML</p>
              <Code :text="listBindingHTML" language="html"></Code>

              <v-alert type="warning" density="compact" variant="tonal" class="mt-4">
                Lưu ý: Để bind List, các thẻ input phải có index dạng <code>Name[i].Property</code>. Razer Tag Helper <code>asp-for</code> sẽ tự động xử lý nếu bạn dùng vòng lặp <code>for</code>.
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

const basicBindingCS = `public class CreateModel : PageModel
{
    [BindProperty]
    public string FullName { get; set; } // Liên kết với input text

    [BindProperty]
    public int Age { get; set; } // Tự động convert sang kiểu int

    [BindProperty]
    public DateTime Birthday { get; set; } // Tự động convert sang DateTime

    public void OnPost()
    {
        // Khi form submit, dữ liệu sẽ tự động có trong các biến trên
        var name = FullName;
    }
}`;

const basicBindingHTML = `<form method="post">
    Tên: <input asp-for="FullName" class="form-control" />
    Tuổi: <input asp-for="Age" type="number" class="form-control" />
    Ngày sinh: <input asp-for="Birthday" type="date" class="form-control" />
    <button type="submit">Gửi</button>
</form>`;

const selectionBindingCS = `[BindProperty]
public string Gender { get; set; } // Cho Radio hoặc Select

[BindProperty]
public bool IsActive { get; set; } // Cho Checkbox (true/false)

[BindProperty]
public List<int> SelectedSkillIds { get; set; } // Cho Multi-select hoặc nhiều Checkbox`;

const selectionBindingHTML = `<form method="post">
    <!-- Radio Button -->
    <input type="radio" asp-for="Gender" value="Male" /> Nam
    <input type="radio" asp-for="Gender" value="Female" /> Nữ

    <!-- Checkbox (Single) -->
    <input type="checkbox" asp-for="IsActive" /> Kích hoạt?

    <!-- Select Dropdown -->
    <select asp-for="Gender" class="form-control">
        <option value="Male">Nam</option>
        <option value="Female">Nữ</option>
    </select>

    <button type="submit">Lưu</button>
</form>`;

const checkboxListBindingCS = `public class HobbyModel : PageModel
{
    [BindProperty]
    public List<string> SelectedHobbies { get; set; } = new List<string>();

    public void OnPost()
    {
        // SelectedHobbies sẽ chứa "Sport", "Music" tùy vào checkbox được check
    }
}`;

const checkboxListBindingHTML = `<form method="post">
    <h6>Chọn sở thích của bạn:</h6>
    <input type="checkbox" name="SelectedHobbies" value="Sport" /> Thể thao <br/>
    <input type="checkbox" name="SelectedHobbies" value="Music" /> Âm nhạc <br/>
    <input type="checkbox" name="SelectedHobbies" value="Coding" /> Lập trình <br/>
    <input type="checkbox" name="SelectedHobbies" value="Travel" /> Du lịch <br/>

    <button type="submit">Gửi</button>
</form>`;

const modelBindingCS = `public class RegisterModel : PageModel
{
    [BindProperty]
    public User NewUser { get; set; } // Gom vào object

    public void OnPost()
    {
        if (ModelState.IsValid)
        {
            // Truy cập qua: NewUser.Email, NewUser.Password...
        }
    }
}`;

const modelBindingHTML = `<form method="post">
    Email: <input asp-for="NewUser.Email" />
    Mật khẩu: <input asp-for="NewUser.Password" type="password" />
    <button type="submit">Đăng ký</button>
</form>`;

const listBindingCS = `[BindProperty]
public List<Student> Students { get; set; }

public void OnGet()
{
    // Giả sử load 3 student để edit
    Students = _context.Students.Take(3).ToList();
}`;

const listBindingHTML = `<form method="post">
    @for (int i = 0; i < Model.Students.Count; i++)
    {
        <div>
            <input type="hidden" asp-for="Students[i].Id" />
            Tên: <input asp-for="Students[i].Name" />
            Điểm: <input asp-for="Students[i].Grade" />
        </div>
    }
    <button type="submit">Cập nhật tất cả</button>
</form>`;
</script>

<style scoped>
.ml-4 {
  margin-left: 24px;
}
.ml-1 {
  margin-left: 4px;
}
</style>
