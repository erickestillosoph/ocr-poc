import { NotFoundPage } from "@/pages/not-found/not-found-page";

type Props = {
  title: string;
};

export const NotFoundContainer = ({ title }: Props) => {
  return <NotFoundPage stubSlot={title} />;
};
