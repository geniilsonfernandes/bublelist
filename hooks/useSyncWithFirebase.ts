// import { useMemo, useRef } from "react";

// export function useSyncWithFirebase(lists: any) {
//   const previousData = useRef<any>(null);

//   const sync = useMemo(
//     () =>
//       debounce(async (lists: any) => {
//         if (previousData.current && isEqual(previousData.current, lists)) {
//           return;
//         }

//         const docRef = doc(db, "lists", "user_id");
//         await setDoc(docRef, lists);

//         previousData.current = lists;
//       }, 10000),
//     []
//   );

//   useEffect(() => {
//     sync(lists);
//   }, [lists, sync]);

//   useEffect(() => {
//     const docRef = doc(db, "lists", "user_id");

//     const unsubscribe = onSnapshot(docRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const data = snapshot.data();
//         previousData.current = data;
//         useListStore.setState({ lists: data });
//       }
//     });

//     return () => {
//       unsubscribe();
//     };
//   }, []);
// }
