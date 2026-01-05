import { Button } from '@repo/shadcn-comps/button';
// 导入表单相关
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@repo/shadcn-comps/field';
import { Input } from '@repo/shadcn-comps/input';
import { toast } from '@repo/shadcn-comps/sonner'; // 导入消息提示组件
import { Textarea } from '@repo/shadcn-comps/textarea';
// 导入表单验证库和HRF相关插件（我都将表单所需相关额外依赖都放到 ui-comps/form 中，方便统一管理）
import { Controller, useForm, z, zodResolver } from '@repo/ui-comps/form';

// 定义表单验证规则
const formSchema = z.object({
  title: z
    .string()
    .min(5, '标题至少需要5个字符。')
    .max(32, '标题最多32个字符。'),
  description: z
    .string()
    .min(10, '描述至少需要10个字符。')
    .max(30, '描述最多30个字符。'),
});

// 根据表单验证规则推导出表单数据类型
type FormValues = z.infer<typeof formSchema>;

/**
 * 问题反馈表单组件
 * 使用 react-hook-form 进行表单管理，zod 进行表单验证
 */
export default function BugReportForm() {
  // 初始化表单，配置验证器和默认值
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema), // 使用 zod 验证器
    defaultValues: {
      title: '',
      description: '',
    },
  });

  // 表单提交处理函数
  function onSubmit(data: FormValues) {
    toast.info(JSON.stringify(data, null, 2));
  }

  return (
    <div className="p-2 w-100">
      {/* 表单主体 */}
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          {/* title字段 - 使用 Controller 包装以集成 react-hook-form */}
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>标题</FieldLabel>
                <Input {...field} placeholder="请输入" />
                <div className="min-h-5">
                  <FieldError errors={[fieldState.error]} />
                </div>
              </Field>
            )}
          />

          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>描述</FieldLabel>
                <Textarea
                  {...field}
                  placeholder="请输入"
                  rows={6}
                  className="min-h-24 resize-none"
                />
                <div className="min-h-5">
                  <FieldError errors={[fieldState.error]} />
                </div>
              </Field>
            )}
          />
        </FieldGroup>

        {/* 操作按钮组 */}
        <Field orientation="horizontal" className="mt-6">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            重置
          </Button>
          <Button type="submit">提交</Button>
        </Field>
      </form>
    </div>
  );
}
