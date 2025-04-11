import { Provider } from "jotai";

import { jotaiStore } from "./store";

type Props = {
  children: React.ReactNode;
};

export const JotaiProvider = ({ children }: Props) => {
  return <Provider store={jotaiStore}>{children}</Provider>;
};
