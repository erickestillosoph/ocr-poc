// import {
//           FetchViewResultsPageDocument,
//           ViewResultsPageInsertInput,
//           useInsertViewResultsPageMutation,
//         } from '@shared/api';
//         import { useCustomToast } from '@shared/ui';
//         import { Logger } from '@shared/lib';
//         import { useCallback } from 'react';
//         import { ViewResultsPageSchema } from '../validations/view-results-page.schema';

//     export const useViewResultsPageMutation = ({
//             reset,
//             userId,
//           }: Props) => {

//             const [insertViewResultsPageMutation, { loading }] =
//               useInsertViewResultsPageMutation();
//             const toast = useCustomToast();

//             const insertViewResultsPage = useCallback(
//               async (input: ViewResultsPageInsertInput) => {
//                 if (!userId) {
//                   toast.error({
//                     title: 'エラー',
//                     description: 'ユーザーIDが無効です。',
//                   });
//                   Logger.error('userId is null or undefined.');
//                   return;
//                 }

//                 await insertViewResultsPageMutation({
//                   variables: {
//                     object: {
//                       prefecture: input.prefecture,
//                       city: input.city,
//                       startTime: input.startTime,
//                       endTime: input.endTime,
//                     },
//                   },
//                   onCompleted: () => {
//                     toast.success({
//                       title: '通知設定の保存に成功しました。',
//                     });
//                   },
//                   onError: (error) => {
//                     toast.error({
//                       title: '通知設定の保存に失敗しました。',
//                     });
//                     Logger.error(error);
//                   },
//                   refetchQueries: [
//                     {
//                       query: FetchViewResultsPageDocument,
//                       variables: {
//                         where: {
//                           userId: { _eq: userId },
//                         },
//                       },
//                     },
//                   ],
//                 });
//               },
//               // eslint-disable-next-line react-hooks/exhaustive-deps
//               [insertViewResultsPageMutation, reset],
//             );

//             return { insertViewResultsPage, loading };
//           };
