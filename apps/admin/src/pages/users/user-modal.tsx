import { Button } from '@repo/shadcn-comps/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@repo/shadcn-comps/dialog';
import { FieldLabel } from '@repo/shadcn-comps/field';
import { Input } from '@repo/shadcn-comps/input';
import { Label } from '@repo/shadcn-comps/label';
import { RadioGroup, RadioGroupItem } from '@repo/shadcn-comps/radio-group';
import { Controller, useForm, z, zodResolver } from '@repo/ui-comps/form';
import type { User } from './type';

const formSchema = z.object({
  name: z
    .string()
    .min(2, '姓名至少需要2个字符。')
    .max(20, '姓名最多20个字符。'),
  email: z.string().email('请输入有效的邮箱地址。'),
  gender: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface UserModalProps {
  open: boolean;
  user?: User;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormValues & { id?: number }) => Promise<void>;
}

export default function UserModal({
  open,
  user,
  onOpenChange,
  onSubmit,
}: UserModalProps) {
  const isEdit = !!user;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      gender: user?.gender ?? true,
    },
  });

  const handleSubmit = async (data: FormValues) => {
    await onSubmit({ ...data, id: user?.id });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? '编辑用户' : '新增用户'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="flex items-center gap-4">
                <FieldLabel className="text-sm w-12 shrink-0">姓名</FieldLabel>
                <div className="flex-1">
                  <Input {...field} placeholder="请输入姓名" />
                  {fieldState.error && (
                    <p className="text-sm text-red-500 mt-1">{fieldState.error.message}</p>
                  )}
                </div>
              </div>
            )}
          />

          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="flex items-center gap-4">
                <FieldLabel className="text-sm w-12 shrink-0">邮箱</FieldLabel>
                <div className="flex-1">
                  <Input {...field} type="email" placeholder="请输入邮箱" />
                  {fieldState.error && (
                    <p className="text-sm text-red-500 mt-1">{fieldState.error.message}</p>
                  )}
                </div>
              </div>
            )}
          />

          <Controller
            name="gender"
            control={form.control}
            render={({ field }) => (
              <div className="flex items-center gap-4">
                <FieldLabel className="text-sm w-12 shrink-0">性别</FieldLabel>
                <RadioGroup
                  value={field.value ? 'male' : 'female'}
                  onValueChange={(value) => field.onChange(value === 'male')}
                  className="flex gap-4"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male" className="cursor-pointer">男</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female" className="cursor-pointer">女</Label>
                  </div>
                </RadioGroup>
              </div>
            )}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              取消
            </Button>
            <Button type="submit">{isEdit ? '保存' : '创建'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

