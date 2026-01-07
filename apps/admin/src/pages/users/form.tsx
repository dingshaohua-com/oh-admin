import { Button } from "@repo/shadcn-comps/button";
// 导入表单相关
import { FieldLabel } from "@repo/shadcn-comps/field";
import { Input } from "@repo/shadcn-comps/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/shadcn-comps/select";
// 导入表单验证库和HRF相关插件（我都将表单所需相关额外依赖都放到 ui-comps/form 中，方便统一管理）
import { Controller, useForm, z, zodResolver } from "@repo/ui-comps/form";
import { useControllableValue } from "ahooks";
import { useEffect } from "react";

// 定义表单结构（搜索表单，无需校验）
const formSchema = z.object({
  name: z.string(),
  email: z.string(),
  gender: z.boolean().optional(),
});

// 根据表单验证规则推导出表单数据类型
export type FormValues = z.infer<typeof formSchema>;

const defaultFormValues: FormValues = {
  name: "",
  email: "",
  gender: undefined,
};

interface SearchFormProps {
  value?: FormValues;
  defaultValue?: FormValues;
  onChange?: (value: FormValues) => void;
  onSubmit?: (value: FormValues) => void;
  onReset?: () => void;
}

/**
 * 用户表单组件
 * 使用 react-hook-form 进行表单管理，zod 进行表单验证
 * 支持受控和非受控两种模式
 */
export default function SearchForm(props: SearchFormProps) {
  // 使用 useControllableValue 处理表单值，支持受控和非受控两种模式
  const [formValues, setFormValues] = useControllableValue<FormValues>(props, {
    defaultValue: defaultFormValues,
  });

  // 初始化表单，配置验证器和默认值
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema), // 使用 zod 验证器
    defaultValues: formValues,
  });

  // 监听外部 value 变化，同步到 react-hook-form
  useEffect(() => {
    form.reset(formValues);
  }, [formValues, form]);

  // 表单提交处理函数
  function handleSubmit(data: FormValues) {
    setFormValues(data);
    props.onSubmit?.(data);
  }

  return (
    <div className="px-4 py-6 bg-white">
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          {/* 姓名 */}
          <Controller
            name="name"
            control={form.control}
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <FieldLabel className="text-sm whitespace-nowrap">
                  姓名
                </FieldLabel>
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
                <FieldLabel className="text-sm whitespace-nowrap">
                  邮箱
                </FieldLabel>
                <Input
                  {...field}
                  type="email"
                  placeholder="请输入邮箱"
                  className="w-50"
                />
              </div>
            )}
          />

          {/* 性别 */}
          <Controller
            name="gender"
            control={form.control}
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <FieldLabel className="text-sm whitespace-nowrap">
                  性别
                </FieldLabel>
                <Select
                  value={field.value === undefined ? undefined : field.value ? "male" : "female"}
                  onValueChange={(value) => {
                    field.onChange(value === "male" ? true : value === "female" ? false : undefined);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="请选择" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="male">男</SelectItem>
                      <SelectItem value="female">女</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          {/* 按钮 */}
          <div className="flex gap-2 w-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                form.reset(defaultFormValues);
                setFormValues(defaultFormValues);
                props.onReset?.();
              }}
            >
              重置
            </Button>
            <Button type="submit" size="sm">
              查询
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
