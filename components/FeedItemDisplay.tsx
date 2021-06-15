import { NavigationProp, useNavigation } from "@react-navigation/native";
import React from "react";
import { Card, Text } from "react-native-paper";
import { FeedItem, RootStackParamList } from "../shared-types";

export default function FeedItemDisplay({ item }: { item: FeedItem }) {
  const date = new Date(Date.parse(item.published));
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const url = item.links[0].url;
  const onPress = React.useCallback(() => {
    navigation.navigate("Article", { url: url, title: item.title });
  }, [url]);
  return (
    <Card
      style={{
        marginHorizontal: 10,
        paddingRight: 10
      }}
      onPress={onPress}
    >
      <Card.Title
        titleNumberOfLines={2}
        title={item.title}
        titleStyle={{ lineHeight: 26 }}
        subtitle={date.toLocaleDateString()}
      />
      <Card.Content>
        <Text numberOfLines={3}>
          {item.description}
        </Text>
      </Card.Content>
    </Card>
  );
}