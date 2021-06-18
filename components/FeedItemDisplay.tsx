import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useCallback } from "react";
import { Text } from "react-native";
import { Avatar, Button, Card, Title, Paragraph } from "react-native-paper";
import { FeedItem, RootStackParamList } from "../shared-types";
import ReactNativeLogo from "./ReactNativeLogo";

const renderLeft = (props: any) => (
  <ReactNativeLogo width={35} height={35} {...props} />
);

const dateOptions: Intl.DateTimeFormatOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

export default function FeedItemDisplay({ item }: { item: FeedItem }) {
  const date = new Date(Date.parse(item.published));
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const url = item.links[0].url;
  const onPress = useCallback(() => {
    navigation.navigate("Article", { url: url, title: item.title });
  }, [url]);
  return (
    <Card
      style={{
        marginHorizontal: 10,
        paddingRight: 15,
      }}
      onPress={onPress}
    >
      <Card.Title
        style={{ minHeight: 0, paddingVertical: 10 }}
        left={renderLeft}
        titleNumberOfLines={2}
        title={item.title}
        titleStyle={{ lineHeight: 26 }}
        subtitle={date.toLocaleDateString("en-US", dateOptions)}
        subtitleStyle={{ paddingTop: 5 }}
      />
      <Card.Content>
        <Paragraph numberOfLines={3} style={{ color: "gray" }}>
          {item.description}
        </Paragraph>
      </Card.Content>
    </Card>
  );
}
