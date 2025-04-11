// import {
//           FetchCameraAccessDocument,
//           CameraAccessInsertInput,
//           useInsertCameraAccessMutation,
//         } from '@shared/api';
//         import { useCustomToast } from '@shared/ui';
//         import { CameraAccessSchema } from '../validations/camera-access.schema';

//     export const useCameraAccessMutation = ({
//             reset,
//             userId,
//           }: Props) => {

//             const [insertCameraAccessMutation, { loading }] =
//               useInsertCameraAccessMutation();
//             const toast = useCustomToast();

//             const insertCameraAccess = useCallback(
//               async (input: CameraAccessInsertInput) => {
//                 if (!userId) {
//                   toast.error({
//                     title: 'エラー',
//                     description: 'ユーザーIDが無効です。',
//                   });
//                   Logger.error('userId is null or undefined.');
//                   return;
//                 }

//                 await inserCameraAccessMutation({
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
//                       query: FetchCameraAccessDocument,
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
//               [insertCameraAccessMutation, reset],
//             );

//             return { insertCameraAccess, loading };
//           };
