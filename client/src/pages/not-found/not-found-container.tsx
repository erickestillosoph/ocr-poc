import { NotFoundContainer } from "@/features";
import { NotFoundPage } from "./not-found-page";
import { PageWrapper } from "@/shared/ui/page-wrapper";

export const NotFoundPageContainer = () => {
  return (
    <PageWrapper>
      <NotFoundPage stubSlot={<NotFoundContainer title="404エラー画面" />} />
    </PageWrapper>
  );
};
