// import React, { useState } from "react";
// import { Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
// import Icon from "react-native-vector-icons/Feather"; // Users, Plus, Settings, Share2, History, LogOut
// import { useApp } from "../context/AppContext";

// import { movies } from "../data/movies";

// export function GroupsScreen() {
//     const { userData, updateUserData } = useApp();
//     const [selectedGroup, setSelectedGroup] = useState(userData?.groups?.[0] || null);
//     const [isCreatingGroup, setIsCreatingGroup] = useState(false);
//     const [newGroupName, setNewGroupName] = useState("");

//     const handleCreateGroup = () => {
//         if (newGroupName) {
//             const newGroup = {
//                 id: Date.now().toString(),
//                 name: newGroupName,
//                 avatar: "https://images.unsplash.com/photo-1574267432644-f610fa6e6d46?w=100&h=100&fit=crop",
//                 members: ["You"],
//                 sharedMovies: [],
//             };
//             const updatedGroups = [...(userData?.groups || []), newGroup];
//             updateUserData({ groups: updatedGroups });
//             setSelectedGroup(newGroup);
//             setIsCreatingGroup(false);
//             setNewGroupName("");
//         }
//     };

//     const handleLeaveGroup = (groupId: string) => {
//         // const updatedGroups = userData?.groups?.filter((g) => g.id !== groupId) || [];
//         // updateUserData({ groups: updatedGroups });
//         // setSelectedGroup(updatedGroups[0] || null);
//     };

//     const groupMovies = selectedGroup
//         ? movies.filter((m) => selectedGroup.sharedMovies.includes(m.id))
//         : [];

//     const groupRecommendations = movies.slice(0, 6);

//     return (
//         <ScrollView style={styles.container}>
//             {/* Header */}
//             <View style={styles.header}>
//                 <Text style={styles.headerTitle}>Groups</Text>
//                 <TouchableOpacity onPress={() => setIsCreatingGroup(true)} style={styles.plusButton}>
//                     <Icon name="plus" size={20} color="white" />
//                 </TouchableOpacity>
//             </View>

//             {/* Create Group Modal */}
//             <Modal visible={isCreatingGroup} animationType="slide" transparent>
//                 <View style={styles.modalBackdrop}>
//                     <View style={styles.modalContent}>
//                         <Text style={styles.modalTitle}>Create New Group</Text>
//                         <TextInput
//                             placeholder="Group name"
//                             placeholderTextColor="#94A3B8"
//                             value={newGroupName}
//                             onChangeText={setNewGroupName}
//                             style={styles.input}
//                         />
//                         <TouchableOpacity onPress={handleCreateGroup} style={styles.createButton}>
//                             <Text style={{ color: "white", fontWeight: "bold" }}>Create Group</Text>
//                         </TouchableOpacity>
//                         <TouchableOpacity onPress={() => setIsCreatingGroup(false)} style={styles.cancelButton}>
//                             <Text style={{ color: "#94A3B8" }}>Cancel</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             </Modal>

//             {/* Groups List */}
//             {userData?.groups && userData.groups.length > 0 ? (
//                 <>
//                     <View style={styles.groupsList}>
//                         {userData.groups.map((group) => (
//                             <TouchableOpacity
//                                 key={group.id}
//                                 onPress={() => setSelectedGroup(group)}
//                                 style={[styles.groupItem, selectedGroup?.id === group.id && styles.groupSelected]}
//                             >
//                                 <Image source={{ uri: group.avatar }} style={styles.groupAvatar} />
//                                 <View style={{ flex: 1 }}>
//                                     <Text style={styles.groupName}>{group.name}</Text>
//                                     <Text style={styles.groupMembers}>{group.members.length} members</Text>
//                                 </View>
//                                 <Icon name="users" size={20} color="#94A3B8" />
//                             </TouchableOpacity>
//                         ))}
//                     </View>

//                     {/* Selected Group Details */}
//                     {selectedGroup && (
//                         <View style={styles.groupDetails}>
//                             {/* Group Header */}
//                             <View style={styles.groupHeader}>
//                                 <Image source={{ uri: selectedGroup.avatar }} style={styles.selectedAvatar} />
//                                 <View style={{ flex: 1, marginLeft: 12 }}>
//                                     <Text style={styles.selectedGroupName}>{selectedGroup.name}</Text>
//                                     <Text style={styles.selectedGroupMembers}>{selectedGroup.members.join(", ")}</Text>
//                                 </View>
//                             </View>

//                             <View style={styles.groupButtons}>
//                                 <TouchableOpacity style={styles.actionButton}>
//                                     <Icon name="share-2" size={18} color="white" style={{ marginRight: 6 }} />
//                                     <Text style={{ color: "white" }}>Invite</Text>
//                                 </TouchableOpacity>
//                                 <TouchableOpacity style={styles.actionButton}>
//                                     <Icon name="settings" size={18} color="white" style={{ marginRight: 6 }} />
//                                     <Text style={{ color: "white" }}>Settings</Text>
//                                 </TouchableOpacity>
//                             </View>

//                             {/* Leave Group */}
//                             <TouchableOpacity onPress={() => handleLeaveGroup(selectedGroup.id)} style={styles.leaveButton}>
//                                 <Icon name="log-out" size={18} color="#F87171" style={{ marginRight: 6 }} />
//                                 <Text style={{ color: "#F87171" }}>Leave Group</Text>
//                             </TouchableOpacity>

//                             {/* Group Recommendations */}
//                             <Text style={styles.sectionTitle}>Group Picks</Text>
//                             <Text style={styles.sectionSubtitle}>Based on everyone's taste</Text>
//                             <View style={styles.recommendations}>
//                                 {groupRecommendations.map((movie) => (
//                                     <View key={movie.id} style={styles.movieCard}>
//                                         <Image source={{ uri: movie.poster }} style={styles.moviePoster} />
//                                         <View style={styles.movieRating}>
//                                             <Text style={{ color: "white", fontSize: 12 }}>{Math.floor(Math.random() * 20) + 80}%</Text>
//                                         </View>
//                                         <Text style={styles.movieTitle} numberOfLines={1}>
//                                             {movie.title}
//                                         </Text>
//                                     </View>
//                                 ))}
//                             </View>

//                             {/* Watch History */}
//                             <View style={{ marginTop: 24 }}>
//                                 <View style={styles.historyHeader}>
//                                     <Icon name="clock" size={20} color="#94A3B8" style={{ marginRight: 6 }} />
//                                     <Text style={styles.sectionTitle}>Watch History</Text>
//                                 </View>
//                                 {groupMovies.length > 0 ? (
//                                     groupMovies.map((movie) => (
//                                         <View key={movie.id} style={styles.historyItem}>
//                                             <Image source={{ uri: movie.poster }} style={styles.historyPoster} />
//                                             <View style={{ flex: 1, marginLeft: 8 }}>
//                                                 <Text style={styles.movieTitle}>{movie.title}</Text>
//                                                 <Text style={{ color: "#94A3B8", fontSize: 12 }}>{movie.year}</Text>
//                                                 <Text style={{ color: "#6B7280", fontSize: 10 }}>Watched together</Text>
//                                             </View>
//                                         </View>
//                                     ))
//                                 ) : (
//                                     <View style={styles.noHistory}>
//                                         <Text style={{ color: "#94A3B8" }}>No movies watched together yet</Text>
//                                     </View>
//                                 )}
//                             </View>
//                         </View>
//                     )}
//                 </>
//             ) : (
//                 <View style={styles.noGroups}>
//                     <View style={styles.noGroupsIcon}>
//                         <Icon name="users" size={32} color="white" />
//                     </View>
//                     <Text style={styles.noGroupsTitle}>No Groups Yet</Text>
//                     <Text style={styles.noGroupsSubtitle}>Create a group to watch movies together</Text>
//                     <TouchableOpacity onPress={() => setIsCreatingGroup(true)} style={styles.createButton}>
//                         <Icon name="plus" size={16} color="white" style={{ marginRight: 4 }} />
//                         <Text style={{ color: "white", fontWeight: "bold" }}>Create Your First Group</Text>
//                     </TouchableOpacity>
//                 </View>
//             )}
//         </ScrollView>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: "black", padding: 16 },
//     header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
//     headerTitle: { color: "white", fontSize: 24, fontWeight: "bold" },
//     plusButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#6B8FE4", justifyContent: "center", alignItems: "center" },
//     modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
//     modalContent: { width: "80%", backgroundColor: "#0A0A1A", padding: 20, borderRadius: 12 },
//     modalTitle: { color: "white", fontSize: 18, fontWeight: "bold", marginBottom: 12 },
//     input: { borderWidth: 1, borderColor: "#6B8FE4", borderRadius: 8, color: "white", paddingHorizontal: 12, paddingVertical: 8, marginBottom: 12 },
//     createButton: { backgroundColor: "#6B8FE4", padding: 12, borderRadius: 8, alignItems: "center", marginBottom: 8, flexDirection: "row", justifyContent: "center" },
//     cancelButton: { alignItems: "center", padding: 8 },
//     groupsList: { marginBottom: 16 },
//     groupItem: { flexDirection: "row", alignItems: "center", padding: 12, borderRadius: 12, marginBottom: 8, backgroundColor: "#2A2A4A" },
//     groupSelected: { backgroundColor: "#6B8FE4" },
//     groupAvatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
//     groupName: { color: "white", fontSize: 16, fontWeight: "500" },
//     groupMembers: { color: "#94A3B8", fontSize: 12 },
//     groupDetails: { marginBottom: 24 },
//     groupHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
//     selectedAvatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#2A2A4A" },
//     selectedGroupName: { color: "white", fontSize: 18, fontWeight: "bold" },
//     selectedGroupMembers: { color: "#94A3B8", fontSize: 12 },
//     groupButtons: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
//     actionButton: { flexDirection: "row", alignItems: "center", padding: 8, backgroundColor: "rgba(107,143,228,0.1)", borderRadius: 8 },
//     leaveButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 12, borderRadius: 8, borderWidth: 1, borderColor: "#F87171", marginBottom: 12 },
//     sectionTitle: { color: "white", fontSize: 18, fontWeight: "bold" },
//     sectionSubtitle: { color: "#94A3B8", fontSize: 12, marginBottom: 8 },
//     recommendations: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
//     movieCard: { width: "30%", marginBottom: 12 },
//     moviePoster: { width: "100%", aspectRatio: 2 / 3, borderRadius: 8 },
//     movieRating: { position: "absolute", top: 4, right: 4, backgroundColor: "#6B8FE4", borderRadius: 4, paddingHorizontal: 4, paddingVertical: 2 },
//     movieTitle: { color: "white", fontSize: 12, marginTop: 4 },
//     historyHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
//     historyItem: { flexDirection: "row", backgroundColor: "#2A2A4A", padding: 8, borderRadius: 12, marginBottom: 8 },
//     historyPoster: { width: 48, height: 72, borderRadius: 8 },
//     noHistory: { padding: 16, alignItems: "center", backgroundColor: "#2A2A4A", borderRadius: 12 },
//     noGroups: { alignItems: "center", paddingVertical: 32 },
//     noGroupsIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#6B8FE4", justifyContent: "center", alignItems: "center", marginBottom: 12 },
//     noGroupsTitle: { color: "white", fontSize: 18, fontWeight: "bold", marginBottom: 4 },
//     noGroupsSubtitle: { color: "#94A3B8", fontSize: 14, marginBottom: 12 },
// });
