import React, { useState, useCallback } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

interface Props {
  url: string;
  onClose: () => void;
}

const InAppBrowser: React.FC<Props> = ({ url, onClose }) => {
  const [loading, setLoading] = useState(true);

  const handleNavChange = useCallback(
    (event: any) => {
      const currentUrl = event?.url || "";
      console.log("🌐 Navigated to:", currentUrl);

      if (currentUrl.startsWith("https://kaamdham.com/account-settings?modal=true")) {
        onClose(); // ✅ Close WebView automatically
      }
    },
    [onClose]
  );

  return (
    <View style={styles.container}>
      {loading && (
        <ActivityIndicator
          style={StyleSheet.absoluteFill}
          color="#000"
          size="large"
        />
      )}
      <WebView
        source={{ uri: url }}
        onLoadEnd={() => setLoading(false)}
        onNavigationStateChange={handleNavChange}
        startInLoadingState
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    zIndex: 999,
  },
});

export default InAppBrowser;
