// import {
//           FetchUploadPageDocument,
//           UploadPageInsertInput,
//           useInsertUploadPageMutation,
//         } from '@shared/api';
//         import { useCustomToast } from '@shared/ui';
//         import { UploadPageSchema } from '../validations/upload-page.schema';

//     export const useUploadPageMutation = ({
//             reset,
//             userId,
//           }: Props) => {

//             const [insertUploadPageMutation, { loading }] =
//               useInsertUploadPageMutation();
//             const toast = useCustomToast();

//             const insertUploadPage = useCallback(
//               async (input: UploadPageInsertInput) => {
//                 if (!userId) {
//                   toast.error({
//                     title: 'エラー',
//                     description: 'ユーザーIDが無効です。',
//                   });
//                   Logger.error('userId is null or undefined.');
//                   return;
//                 }

//                 await inserUploadPageMutation({
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
//                       query: FetchUploadPageDocument,
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
//               [insertUploadPageMutation, reset],
//             );

//             return { insertUploadPage, loading };
//           };
