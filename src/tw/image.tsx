import React from "react";
import { StyleSheet } from "react-native";
import { Image as ExpoImage } from "expo-image";

type ImageProps = React.ComponentProps<typeof ExpoImage> & {
  className?: string;
};

function CSSImage({ style, className, ...props }: ImageProps) {
  const flat = StyleSheet.flatten(style) || {};
  const { objectFit, objectPosition, ...restStyle } = flat as any;
  return (
    <ExpoImage
      contentFit={objectFit ?? "cover"}
      contentPosition={objectPosition}
      style={restStyle}
      {...props}
    />
  );
}

export const Image = React.forwardRef<
  typeof ExpoImage,
  ImageProps
>((props, _ref) => <CSSImage {...props} />);
Image.displayName = "TwImage";
