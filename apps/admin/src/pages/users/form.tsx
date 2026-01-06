import { Button } from '@repo/shadcn-comps/button';
// 导入表单相关
import { FieldLabel } from '@repo/shadcn-comps/field';
import { Input } from '@repo/shadcn-comps/input';
import { toast } from '@repo/shadcn-comps/sonner'; // 导入消息提示组件
// 导入表单验证库和HRF相关插件（我都将表单所需相关额外依赖都放到 ui-comps/form 中，方便统一管理）
import { Controller, useForm, z, zodResolver } from '@repo/ui-comps/form';

// 定义表单验证规则
const formSchema = z.object({
  name: z
    .string()
    .min(2, '姓名至少需要2个字符。')
    .max(20, '姓名最多20个字符。'),
  email: z
    .string()
    .email('请输入有效的邮箱地址。'),
  role: z
    .string()
    .min(1, '请输入角色。')
    .max(20, '角色最多20个字符。'),
});

// 根据表单验证规则推导出表单数据类型
type FormValues = z.infer<typeof formSchema>;

/**
 * 用户表单组件
 * 使用 react-hook-form 进行表单管理，zod 进行表单验证
 */
export default function UserForm() {
  // 初始化表单，配置验证器和默认值
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema), // 使用 zod 验证器
    defaultValues: {
      name: '',
      email: '',
      role: '',
    },
  });

  // 表单提交处理函数
  function onSubmit(data: FormValues) {
    toast.info(JSON.stringify(data, null, 2));
  }

  return (
    <div className="px-4 py-6 bg-white">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          {/* 姓名 */}
          <Controller
            name="name"
            control={form.control}
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <FieldLabel className="text-sm whitespace-nowrap">姓名</FieldLabel>
                <Input {...field} placeholder="请输入姓名" className="w-50" />
              </div>
            )}
          />

          {/* 邮箱 */}
          <Controller
            name="email"
            control={form.control}
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <FieldLabel className="text-sm whitespace-nowrap">邮箱</FieldLabel>
                <Input {...field} type="email" placeholder="请输入邮箱" className="w-50" />
              </div>
            )}
          />

          {/* 角色 */}
          <Controller
            name="role"
            control={form.control}
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <FieldLabel className="text-sm whitespace-nowrap">角色</FieldLabel>
                <Input {...field} placeholder="请输入角色" className="w-50" />
              </div>
            )}
          />

          {/* 按钮 */}
          <div className="flex gap-2 w-100">
            <Button type="button" variant="outline" size="sm" onClick={() => form.reset()}>
              重置
            </Button>
            <Button type="submit" size="sm">提交</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
