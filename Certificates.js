import React, { useState, useEffect } from "react";
import { View } from "react-native";
import moment from "moment-timezone";
import { Dropdown } from "react-native-material-dropdown-v2";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import clone from "lodash/clone";
import isNil from "lodash/isNil";
import isEqual from "lodash/isEqual";
import { FontAwesome } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { Spinner } from "native-base";
import { Appearance } from "react-native";

import {
  FsText,
  FsButton,
  FsButtonActionIcon,
  FsAlert,
} from "./CustomComponents";
import { Colors, Fonts, Styles } from "../constants";
import {
  getCertificateOptionsByOrgId,
  updateCertificates,
} from "../actions/certificates";

const ViewCertificates = ({ certificates }) => {
  if (!certificates) return null;

  const [showMore, setShowMore] = useState(false);

  const certificatesLimitToDisplay = 4;
  let certificatesToDisplay;
  let shouldShowSplice =
    !showMore && certificates.length > certificatesLimitToDisplay;
  let shouldNotShowLimit = certificates.length <= certificatesLimitToDisplay;

  if (shouldShowSplice) {
    certificatesToDisplay = clone(certificates).splice(
      0,
      certificatesLimitToDisplay
    );
  } else {
    certificatesToDisplay = certificates;
  }

  return (
    <View style={{ flex: 1 }}>
      {certificatesToDisplay.length > 0 ? (
        certificatesToDisplay.map((certificateInformation) => (
          <View
            key={Math.random().toString(36).slice(-5)}
            style={{
              flex: 1,
              paddingHorizontal: 15,
              flexDirection: "row",
              paddingTop: 10,
            }}
          >
            <FsText
              style={{
                color: Colors.secondaryDark,
                fontSize: Fonts.size.small,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              {certificateInformation.name}:{" "}
            </FsText>
            <FsText
              style={{
                color: Colors.secondaryDark,
                fontSize: Fonts.size.small,
                textAlign: "center",
              }}
            >
              {moment(certificateInformation.expires_at).format("MM/DD/YY")}
            </FsText>
          </View>
        ))
      ) : (
        <FsText
          style={{
            paddingTop: 10,
            color: Colors.secondaryDark,
            fontSize: Fonts.size.small,
            textAlign: "center",
          }}
        >
          No Certificates
        </FsText>
      )}
      {!shouldNotShowLimit && (
        <FsButton
          onPress={() => {
            setShowMore(!showMore);
          }}
          style={{
            heigth: "100",
            marginRight: 7,
            marginLeft: 7,
          }}
        >
          <FsText
            style={{
              color: Colors.secondaryDark,
              fontSize: Fonts.size.normal,
              padding: 0,
              textAlign: "center",
              minWidth: 45,
            }}
          >
            {!shouldShowSplice ? "Show Less" : "Show More"}{" "}
            <FontAwesome
              name={!shouldShowSplice ? "chevron-up" : "chevron-down"}
              color={Colors.secondaryDark}
              size={15}
            />
          </FsText>
        </FsButton>
      )}
    </View>
  );
};

const EditCertificates = ({
  fomattedCertificateOptions,
  certificates,
  onUpdateCertificate,
  onDeleteCertificate,
}) => {
  const [editingDateForCertificateIndex, setEditingDateForCertificateIndex] =
    useState(null);
  const theme = Appearance.getColorScheme();

  if (!certificates) return null;
  return (
    <View style={{ flex: 1 }} key={Math.random().toString(36).slice(-5)}>
      {certificates.length > 0 &&
        certificates.map(
          (certificateInformation, certificateInformationIndex) => (
            <View
              key={Math.random().toString(36).slice(-5)}
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                paddingTop: 10,
              }}
            >
              <FsButtonActionIcon
                style={{
                  minWidth: 1,
                  alignSelf: "center",
                  alignItems: "center",
                  paddingHorizontal: 0,
                  border: 0,
                  borderColor: "transparent",
                  backgroundColor: "transparent",
                  elevation: 0,
                  shadowOpacity: 0,
                }}
                onPress={() => {
                  onDeleteCertificate(
                    certificateInformationIndex,
                    certificateInformation.relationId
                  );
                }}
                renderIcon={() => (
                  <FontAwesome
                    style={{ paddingLeft: 5 }}
                    name="trash"
                    color={Colors.red}
                    size={15}
                  />
                )}
              />
              <Dropdown
                labelFontSize={0}
                dropdownOffset={{ top: 5 }}
                fontSize={Fonts.size.normal}
                style={{
                  fontFamily: Styles.constant.FontFamily,
                  color: Colors.text,
                  marginTop: 0,
                  backgroundColor: "transparent",
                }}
                containerStyle={{
                  paddingHorizontal: 5,
                  width: "50%",
                }}
                value={certificateInformation.name}
                data={
                  fomattedCertificateOptions
                    ? fomattedCertificateOptions
                    : [
                        {
                          value: "Loading...",
                        },
                      ]
                }
                onChangeText={(selectedType) =>
                  onUpdateCertificate(certificateInformationIndex, {
                    ...certificateInformation,
                    id: fomattedCertificateOptions.find(
                      (certificate) => certificate.value === selectedType
                    ).id,
                    name: selectedType,
                    relationId:
                      certificates[certificateInformationIndex].relationId,
                  })
                }
              />
              <FsButton
                onPress={() =>
                  setEditingDateForCertificateIndex(certificateInformationIndex)
                }
                style={{
                  heigth: "100",
                  marginRight: 7,
                  marginLeft: 7,
                }}
              >
                <FsText
                  style={{
                    color: Colors.black,
                    fontSize: Fonts.size.normal,
                    padding: 0,
                    textAlign: "center",
                    minWidth: 45,
                    textDecorationLine: "underline",
                    textDecorationStyle: "solid",
                  }}
                >
                  Expires:{" "}
                  {moment(certificateInformation.expires_at).format("MM/DD/YY")}
                </FsText>
              </FsButton>
            </View>
          )
        )}
      <DateTimePickerModal
        isDarkModeEnabled={theme === "dark"}
        isVisible={!isNil(editingDateForCertificateIndex)}
        mode="date"
        onConfirm={(date) => {
          onUpdateCertificate(editingDateForCertificateIndex, {
            ...certificates[editingDateForCertificateIndex],
            expires_at: moment
              .utc(date)
              .hours(0)
              .minutes(0)
              .seconds(0)
              .milliseconds(0)
              .format(),
          });
          setEditingDateForCertificateIndex(null);
        }}
        onCancel={() => setEditingDateForCertificateIndex(null)}
      />
    </View>
  );
};

const ActionButtons = ({
  onSave,
  onAddCertificate,
  canSave,
  onCancel,
  hasAddButton,
}) => (
  <>
    {hasAddButton ? (
      <FsButton
        onPress={onAddCertificate}
        style={{
          marginTop: 10,
          paddingVertical: 10,
          paddingHorizontal: 10,
          marginRight: 7,
          marginLeft: 7,
          borderRadius: 10,
        }}
      >
        <FsText
          style={{
            fontSize: Fonts.size.big,
            padding: 0,
            textAlign: "center",
            minWidth: 45,
            color: Colors.secondarySharpDark,
          }}
        >
          + Add New
        </FsText>
      </FsButton>
    ) : (
      <FsText
        style={{
          fontSize: Fonts.size.normal,
          padding: 0,
          textAlign: "center",
          minWidth: 45,
          paddingVertical: 10,
          color: Colors.secondaryDark,
        }}
      >
        There are no certificate options for this property.
      </FsText>
    )}
    <View style={{ flex: 1, flexDirection: "row" }}>
      <FsButton
        onPress={onCancel}
        style={{
          width: "45%",
          marginTop: 10,
          paddingVertical: 10,
          paddingHorizontal: 10,
          marginRight: 7,
          marginLeft: 7,
          backgroundColor: Colors.redDark,
          borderRadius: 10,
        }}
      >
        <FsText
          style={{
            color: Colors.primary,
            fontSize: 13,
            padding: 0,
            textAlign: "center",
            minWidth: 45,
            color: "white",
          }}
        >
          Cancel
        </FsText>
      </FsButton>
      <FsButton
        onPress={onSave}
        disabled={!canSave}
        style={{
          width: "45%",
          marginTop: 10,
          paddingVertical: 10,
          paddingHorizontal: 10,
          marginRight: 7,
          marginLeft: 7,
          backgroundColor: canSave ? Colors.secondarySharpDark : Colors.grey,
          borderRadius: 10,
        }}
      >
        <FsText
          style={{
            color: Colors.primary,
            fontSize: 13,
            padding: 0,
            textAlign: "center",
            minWidth: 45,
            color: "white",
          }}
        >
          Save Certificates
        </FsText>
      </FsButton>
    </View>
  </>
);

export default ({ currentUserData, canEdit, currentOrganizationId }) => {
  const [editing, setEditing] = useState(false);
  const [certificates, setCertificates] = useState(null);
  const [removedCertificateRelationsIds, setRemovedCertificateRelationsIds] =
    useState(null);
  const [loading, setLoading] = useState(true);
  const [fomattedCertificateOptions, setFromattedCertificateOptions] = useState(
    []
  );

  const dispatch = useDispatch();

  const canSave = !isEqual(currentUserData.certificates, certificates);

  useEffect(() => {
    setLoading(true);
    setRemovedCertificateRelationsIds(null);
    initialize();
  }, [editing]);

  const initialize = async () => {
    const certificateOptionsByOrgId = await getCertificateOptionsByOrgId(
      currentOrganizationId
    );

    const certificateOptions = certificateOptionsByOrgId.map(
      ({ name, id }) => ({ value: name, id })
    );

    setFromattedCertificateOptions(certificateOptions);
    setCertificates(currentUserData.certificates);
    setLoading(false);
  };

  const onAddCertificate = () => {
    if (certificates) {
      setCertificates([
        ...certificates,
        {
          name: "",
          expires_at: moment()
            .hours(0)
            .minutes(0)
            .seconds(0)
            .milliseconds(0)
            .format(),
        },
      ]);
    }
  };

  const onDeleteCertificate = async (
    certificateIndex,
    certificateRelationId
  ) => {
    const certificate = certificates[certificateIndex];
    if (certificate.name === "") {
      const updatedCertificates = certificates.filter(
        (existingCertificate, existingCertificateIndex) =>
          existingCertificateIndex !== certificateIndex
      );

      setCertificates(updatedCertificates);
    } else {
      try {
        const certificate = certificates[certificateIndex];
        await FsAlert.alertYesCancel(
          `Revoke Certificate`,
          `Are you sure you want to revoke the ${certificate.name} certificate for this user?`
        );

        if (removedCertificateRelationsIds && !isNil(certificateRelationId)) {
          setRemovedCertificateRelationsIds(
            ...removedCertificateRelationsIds,
            certificateRelationId
          );
        } else if (!isNil(certificateRelationId)) {
          setRemovedCertificateRelationsIds([certificateRelationId]);
        }

        const updatedCertificates = certificates.filter(
          (existingCertificate, existingCertificateIndex) =>
            existingCertificateIndex !== certificateIndex
        );

        setCertificates(updatedCertificates);
      } catch (error) {
        console.log({ error });
      }
    }
  };

  const onUpdateCertificate = (certificateIndex, newCertificateData) => {
    const updatedCertificates = clone(certificates);
    updatedCertificates[certificateIndex] = newCertificateData;
    setCertificates(updatedCertificates);
  };

  const checkValidity = () => {
    if (certificates) {
      if (certificates.length === 0) return true;
      return !certificates.find((certificate) => certificate.name === "");
    }
    return false;
  };

  const saveData = async () => {
    const isValid = checkValidity();
    if (!isValid) {
      FsAlert.alertOk(
        "Incomplete Certifications Data",
        "Please fill in all of your selected certifications' data."
      );
    } else {
      try {
        await FsAlert.alertYesCancel(
          `Save Certificates Changes`,
          `Are you sure you want to save these certificates changes?`
        );
        setLoading(true);
        await dispatch(
          updateCertificates(
            {
              updatedCertificates: certificates,
              removedCertificateRelationsIds,
            },
            currentOrganizationId,
            currentUserData.id
          )
        );
        setEditing(false);
      } catch (error) {}
    }
  };

  const onCancel = async () => {
    if (canSave) {
      try {
        await FsAlert.alertYesCancel(
          `Discard Certificates Changes`,
          `Are you sure you want to discard these certificates changes?`
        );
        setCertificates(currentUserData.certificates); // rolling back to the original ones
        setEditing(false);
      } catch (error) {}
    }
    setEditing(false);
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: 10, paddingVertical: 10 }}>
      <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
        <FsText
          style={{
            color: Colors.secondary,
            fontSize: Fonts.size.xbig,
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Certifications{" "}
        </FsText>
        {!editing && canEdit && (
          <FsButtonActionIcon
            style={{
              minWidth: 1,
              paddingHorizontal: 0,
              paddingTop: 5,
              paddingBottom: 0,
              border: 0,
              borderColor: "transparent",
              backgroundColor: "transparent",
              elevation: 0,
              shadowOpacity: 0,
            }}
            textStyle={{ paddingHorizontal: 0 }}
            onPress={() => {
              setEditing(true);
            }}
            renderIcon={() => (
              <FontAwesome
                style={{ paddingLeft: 5 }}
                name="pencil"
                color={Colors.secondarySharpLight}
                size={15}
              />
            )}
          />
        )}
      </View>

      {loading ? (
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spinner color={Colors.secondary} />
        </View>
      ) : (
        <>
          {editing ? (
            <EditCertificates
              fomattedCertificateOptions={fomattedCertificateOptions}
              certificates={certificates}
              onUpdateCertificate={onUpdateCertificate}
              onDeleteCertificate={onDeleteCertificate}
            />
          ) : (
            <ViewCertificates certificates={currentUserData.certificates} />
          )}
          {editing && (
            <ActionButtons
              onAddCertificate={onAddCertificate}
              canSave={canSave}
              onSave={saveData}
              onCancel={onCancel}
              hasAddButton={fomattedCertificateOptions.length > 0}
            />
          )}
        </>
      )}
    </View>
  );
};
