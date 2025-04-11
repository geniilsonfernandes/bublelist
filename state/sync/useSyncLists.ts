// import { db } from "@/lib/firebase";
// import { collection, DocumentData, DocumentReference, onSnapshot } from "firebase/firestore";
// import { useEffect } from "react";
// import { List, ListsService } from "../lists-service";

// // lista :: array
// // collection :: produtos
//   // doc :: com os seus produtos de cada lista

// function useSyncLists(
//   listsService: ListsService,
//   doc: DocumentReference<DocumentData, DocumentData>
// ) {
//   useEffect(() => {
//     const unsubscribe = onSnapshot(
//       collection(db, "lists", "111", "lists"),
//       (snapshot) => {
//         const lists: List[] = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           name: doc.data().name,
//           budget: doc.data().budget,

//         }));

//         listsService.updateState(lists);

//         // console.log("🔥 Collection atualizada:", lists);
//       }
//     );

//     return () => {
//       unsubscribe();
//     };
//   }, []);
// }

// export default useSyncLists;
