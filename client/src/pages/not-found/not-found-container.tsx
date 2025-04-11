import { NotFoundContainer } from "@/features";
import { NotFoundPage } from "./not-found-page";

export const NotFoundPageContainer = () => {
  return (
    <NotFoundPage stubSlot={<NotFoundContainer title="404エラー画面" />} />
  );
};
