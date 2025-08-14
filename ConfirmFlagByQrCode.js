import { CameraView, Camera } from "expo-camera";
import { Button, Modal, StyleSheet, View } from "react-native";

/**
 * Renders a modal with a QR code scanner (camera app) to confirm a flag
 */
const ConfirmFlagByQrCode = ({ onConfirm, onCancel }) => {
  const handleBarCodeScanned = ({ type, data }) => {
    try {
      const matches = /otss:\/\/flag\?id=(\w+)/i.exec(data);
      if (matches?.[1]) {
        onConfirm(matches[1]);
      } else {
        onCancel();
      }
    } catch (error) {
      console.log(error);
      onCancel();
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={true}
      onRequestClose={onCancel}
    >
      <CameraView
        onBarcodeScanned={handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
      />
      <View style={{ position: "absolute", right: 20, bottom: 20 }}>
        <Button title="Cancel" onPress={onCancel} />
      </View>
    </Modal>
  );
};

export default ConfirmFlagByQrCode;
