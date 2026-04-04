<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12">
        <h2 class="mb-4">Code mẫu EF phần xóa</h2>
        
        <v-alert type="info" variant="tonal" class="mb-6">
          Dùng khi cần xóa một Entity có nhiều quan hệ (One-to-Many, Many-to-Many) mà không muốn bị dính lỗi Foreign Key Constraint.
        </v-alert>

        <v-expansion-panels multiple>
          <!-- Case 1 -->
          <v-expansion-panel>
            <v-expansion-panel-title class="text-primary font-weight-bold">
              Trường hợp 1: Quan hệ Nullable (Optional)
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <p class="text-subtitle-2 mb-4">Dùng khi Foreign Key của bảng con cho phép null. Ta chỉ cần Clear collection.</p>
              
              <div class="mb-4">
                <p class="font-weight-bold">Ví dụ Entity Employee (có các collection Navigations):</p>
                <Code :text="employeeEntityCode" language="csharp" class="mt-2"></Code>
              </div>

              <div class="mb-4">
                <p class="font-weight-bold">Code xử lý xóa:</p>
                <Code :text="deleteMethodCode" language="csharp" class="mt-2"></Code>
                <p class="mt-2 text-body-2 text-grey">
                  <strong>Giải thích:</strong> Khi gọi <code>.Clear()</code>, EF sẽ set Foreign Key của các record con thành <code>null</code> (nếu nullable) và sau đó ta xóa record cha bình thường.
                </p>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!-- Case 2 -->
          <v-expansion-panel>
            <v-expansion-panel-title class="text-error font-weight-bold">
              Trường hợp 2: Quan hệ Not Null (Required)
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <p class="text-subtitle-2 mb-4">Dùng khi Foreign Key bảng con là NOT NULL. Phải xóa con trước, cha sau.</p>

              <div class="mb-4">
                <p class="font-weight-bold">Ví dụ Entity BookCopy và BorrowHistory:</p>
                <div class="d-flex flex-column gap-2">
                  <Code :text="bookCopyEntityCode" language="csharp"></Code>
                  <Code :text="borrowHistoryEntityCode" language="csharp"></Code>
                </div>
              </div>

              <div class="mb-4">
                <p class="font-weight-bold">Code xử lý xóa (Dùng RemoveRange):</p>
                <Code :text="deleteCopyMethodCode" language="csharp" class="mt-2"></Code>
                <p class="mt-2 text-body-2 text-grey">
                  <strong>Giải thích:</strong> Vì Foreign Key là NOT NULL, ta không thể set nó thành null. Ta phải dùng <code>_context.RemoveRange()</code> để xóa sạch các record con trong DB trước khi xóa record cha.
                </p>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!-- Case 3 -->
          <v-expansion-panel>
            <v-expansion-panel-title class="text-warning font-weight-bold">
              Trường hợp 3: Xóa phân cấp & Many-to-Many
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <p class="text-subtitle-2 mb-4">Dùng khi cần xóa record cha và tất cả record con ở nhiều cấp độ (Nested Include), đồng thời gỡ mối quan hệ Many-to-Many.</p>

              <div class="mb-4">
                <p class="font-weight-bold">Code xử lý xóa chi tiết:</p>
                <Code :text="case3DetailedDeleteCode" language="csharp" class="mt-2"></Code>
                <p class="mt-2 text-body-2 text-grey">
                  <strong>Giải thích:</strong> 
                  1. Dùng <code>.ThenInclude()</code> để lấy các record cấp sâu hơn. 
                  2. Dùng <code>.SelectMany()</code> để gom tất cả grandchild records vào một list để xóa <code>RemoveRange</code>. 
                  3. Dùng <code>.Clear()</code> cho các bảng trung gian (Many-to-Many).
                </p>
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

// --- CASE 1 ---
const employeeEntityCode = `using System;
using System.Collections.Generic;

namespace Question1.Models;

public partial class Employee
{
    public int EmployeeId { get; set; }
    public string Name { get; set; } = null!;
    public DateOnly? Dob { get; set; }
    public int? DepartmentId { get; set; }
    public string? Position { get; set; }
    public DateOnly? HireDate { get; set; }

    public virtual Department? Department { get; set; }
    public virtual ICollection<Department> Departments { get; set; } = new List<Department>();
    public virtual ICollection<EmployeeProject> EmployeeProjects { get; set; } = new List<EmployeeProject>();
    public virtual ICollection<EmployeeSkill> EmployeeSkills { get; set; } = new List<EmployeeSkill>();
}`;

const deleteMethodCode = `[HttpDelete("Delete/{employeeId}")]
public IActionResult DeleteById(int employeeId)
{
    var employee = _context.Employees
        .Include(e => e.EmployeeProjects)
        .Include(e => e.EmployeeSkills)
        .Include(e => e.Departments)
        .FirstOrDefault(e => e.EmployeeId == employeeId);

    if (employee == null) return NotFound($"No employee has id {employeeId}");

    // Clear các navigation collections (chỉ work nếu FK cho phép null)
    employee.EmployeeProjects.Clear();
    employee.EmployeeSkills.Clear();
    employee.Departments.Clear();
    
    _context.Employees.Remove(employee);
    _context.SaveChanges();

    return Ok(new { message = "Deleted successfully" });
}`;

// --- CASE 2 ---
const bookCopyEntityCode = `// BookCopy.cs
public partial class BookCopy
{
    public int CopyId { get; set; }
    public int BookId { get; set; }
    public string Status { get; set; } = null!;

    public virtual Book Book { get; set; } = null!;
    public virtual ICollection<BorrowHistory> BorrowHistories { get; set; } = new List<BorrowHistory>();
}`;

const borrowHistoryEntityCode = `// BorrowHistory.cs
public partial class BorrowHistory
{
    public int BorrowId { get; set; }
    public int CopyId { get; set; } // NOT NULL FK
    public int BorrowerId { get; set; }
    public DateOnly BorrowDate { get; set; }
    public DateOnly? ReturnDate { get; set; }

    public virtual Borrower Borrower { get; set; } = null!;
    public virtual BookCopy Copy { get; set; } = null!;
}`;

const deleteCopyMethodCode = `[HttpDelete("copies/{copyId}")]
public IActionResult DeleteCopy(int copyId)
{
    var current = _context.BookCopies
        .Include(bc => bc.BorrowHistories)
        .FirstOrDefault(bc => bc.CopyId == copyId);

    if (current == null)
    {
        return NotFound("No copy found with provided CopyId");
    }

    // Business logic check (Tùy đề bài)
    if (current.BorrowHistories.Any(bh => bh.ReturnDate == null))
    {
        return BadRequest("Cannot delete a copy that is currently borrowed");
    }

    // 1. Phải RemoveRange các con vì FK dính NOT NULL constraint
    _context.BorrowHistories.RemoveRange(current.BorrowHistories);
    
    // 2. Xóa cha
    _context.BookCopies.Remove(current);
    
    // 3. Save
    _context.SaveChanges();
    
    return NoContent();
}`;

// --- CASE 3 ---
const case3DetailedDeleteCode = `[HttpDelete("{bookId}")]
public IActionResult DeleteBook(int bookId)
{
    var current = _context.Books
        .Include(b => b.BookCopies)
        .ThenInclude(bc => bc.BorrowTransactions)
        .Include(b => b.Authors)
        .FirstOrDefault(a => a.BookId == bookId);

    if (current == null) return NotFound();

    var deletedCopies = current.BookCopies.Count();
    var deletedTransactions = current.BookCopies.Sum(bc => bc.BorrowTransactions.Count());

    // 1. Gom tất cả grandchild (Transactions) từ tất cả con (Copies)
    var allTransactions = current.BookCopies.SelectMany(bc => bc.BorrowTransactions).ToList();

    // 2. Xóa theo thứ tự: Cháu -> Con -> Cha
    _context.BorrowTransactions.RemoveRange(allTransactions);
    _context.BookCopies.RemoveRange(current.BookCopies);

    // 3. Xóa quan hệ Many-to-Many (Author - Book)
    current.Authors.Clear();

    // 4. Cuối cùng xóa record cha
    _context.Books.Remove(current);
    _context.SaveChanges();

    return Ok(new
    {
        message = "Book deleted successfully",
        deletedCopies,
        deletedTransactions
    });
}`;
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
</style>
