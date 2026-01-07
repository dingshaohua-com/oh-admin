export type User = {
  id: number;
  name: string;
  email: string;
  gender: boolean;
};

export type GetColumnsProps = {
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}