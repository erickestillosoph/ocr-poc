// import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';
// import { BaseSyntheticEvent } from 'react';
// import { Control } from 'react-hook-form';
// import { ViewResultsPage } from '@shared/api';
// import { ViewResultsPageSchema } from '@shared/lib';
// import { useAppTheme } from '@shared/ui';

// type ViewResultsPageType = {
//   control: Control<ViewResultsPageSchema>;
//   handleSubmit: (e?: BaseSyntheticEvent) => void;
//   loading: boolean;
//   initialValues: ViewResultsPage;
//   isValid: boolean;
// };

// export const ViewResultsPagePage = ({
//   handleSubmit,
//   control,
//   loading,
//   initialValues,
//   isValid,
// }: ViewResultsPageType) => {
//   const { theme } = useAppTheme();

//   return (
//     <form onSubmit={handleSubmit} style={{ height: '100%', marginTop: '20px' }}>
//       <VStack display="grid" alignContent="space-between" height="full">
//         <VStack alignItems="flex-start" spacing="16px">
//         <Button
//           isDisabled={loading || !isValid}
//           color={theme.colors.white}
//           backgroundColor={theme.colors.primary}
//           w="full"
//           position="relative"
//           zIndex="1"
//           rounded="full"
//           px="3"
//           py="4"
//           onClick={handleSubmit}
//         >
//           <span>登録する</span>
//         </Button>
//       </VStack>
//     </form>
//   );
// };
