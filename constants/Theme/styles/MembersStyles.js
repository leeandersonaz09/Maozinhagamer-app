import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../theme";
import metrics from "../metrics";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary, // Defina uma cor de fundo caso haja contraste com o header
  },
  container: {
    flex: 1,
    //backgroundColor: COLORS.background,
  },
  searchContainer: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  input: {
    height: 40,
    width: "85%",
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  SectionStyle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    height: 40,
    borderRadius: 20,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  membersContainerView: {
    paddingHorizontal: 10,
  },
  containerList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingBottom: 80,
  },
  memberImage: {
    width: 80,
    height: 80,
    borderRadius: 40, // Ajustado para manter o círculo proporcional
    alignSelf: "center",
  },
  memberInfo: {
    alignItems: "center",
    marginTop: 10,
  },
  memberName: {
    fontSize: SIZES.medium, // Usando SIZES para maior flexibilidade
    fontWeight: "bold",
    //color: COLORS.textPrimary,
  },
  memberTitle: {
    fontSize: SIZES.small,
    //color: COLORS.textSecondary,
  },
  memberFollowers: {
    fontSize: SIZES.small,
    //color: COLORS.textSecondary,
  },
  memberTagsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 5,
  },
  followButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  followButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: SIZES.medium,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: SIZES.large,
    fontWeight: "bold",
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});

export default styles;
