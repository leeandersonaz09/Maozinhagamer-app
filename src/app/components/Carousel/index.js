import React, { Component, useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Dimensions,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
var { height, width } = Dimensions.get("window");
import { Link } from "expo-router";
import Swiper from "react-native-swiper";

export default function Banner() {
  const dataBanner = [
    {
      id: 1,
      category: "Patrocinadores",
      img: "https://www.saboravida.com.br/wp-content/uploads/2019/11/kopenhagen-apresenta-o-delicioso-espetaculo-do-natal-com-novidades-1.jpg",
      href: "/Maps",
      tittle: "Kopenhagem",
      text: "🔥 Descubra o sabor irresistível do Churrasquinho do Márcio! 🔥\n\nSituado estrategicamente na movimentada Avenida Itapemirim, nas proximidades da imponente Ponte de Itaoca, no número 2491, o Churrasquinho do Márcio é o destino certo para os amantes de um bom churrasco.\n\nEm nosso estabelecimento, você encontrará uma variedade de espetos suculentos, jantinhas caprichadas e acompanhamentos de dar água na boca. E não para por aí! Às quartas-feiras, deliciamos nossos clientes com o tradicional feijão tropeiro, enquanto às sextas-feiras, é a vez do refrescante salpicão. E o melhor de tudo: nossos preços são imbatíveis! Espetos a partir de apenas 8 reais, isso mesmo, você não leu errado!\n\nE para tornar sua experiência ainda mais prática, oferecemos o serviço de delivery sem cobrança de taxa adicional. Basta chamar no WhatsApp e fazer seu pedido! (Inserir número do WhatsApp aqui). Estamos prontos para atendê-lo a partir das 17h30, e as entregas começam pontualmente às 18h30.\n\nNão perca a oportunidade de conhecer o Churrasquinho do Márcio, o verdadeiro paraíso dos sabores na Avenida Itapemirim, próximo à Ponte de Itaoca, número 2491.\n\nLembre-se de personalizar os detalhes, como o nome do estabelecimento e os horários de funcionamento, para que o texto se ajuste perfeitamente à sua divulgação. Boa sorte com sua propaganda! 🍖🔥👍",
    },
    {
      id: 2,
      category: "Patrocinadores",
      img: "https://www.lojassantaifigenia.com.br/_uploads/798/save-games-lojas-santa-efigenia-capa.jpg",
      href: "/Loadouts",
      tittle: "GameFix: Sua Solução em Manutenção de Consoles!",
      text: "Na GameFix, entendemos o valor dos seus videogames. Quando seu console favorito apresenta problemas, nós entramos em ação! Nossos técnicos especializados oferecem:\n\n1. Diagnóstico Rápido: Identificamos a causa raiz do problema em tempo recorde.\n2. Reparos Precisos: Troca de peças, limpeza interna, ressoldagem – fazemos tudo com maestria.\n3. Garantia de Qualidade: Seu console voltará como novo, com garantia de funcionamento.\n4. Atendimento Personalizado: Aqui, você não é apenas um cliente; é parte da nossa comunidade gamer.\n\nVenha nos visitar na Rua dos Joysticks, número 42. Seu videogame merece o melhor! 🕹️🔧",
    },
    {
      id: 3,
      category: "Patrocinadores",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_ncsK9QxAm3y2_d3lKx52RZnz7R906zHRT2h1HPiYmIEDMBTsKLI9E8AWL-SDG4eSnjU&usqp=CAU",
      href: "vnd.youtube://www.youtube.com/@maozinhagamer_diih/streams",
      tittle: "Magazine Luiza: Onde Seus Sonhos se Tornam Realidade!",
      text: "Somos mais que uma loja; somos uma experiência. Na Magazine Luiza, você encontra:\n\n1. Eletrônicos de Última Geração: Smart TVs, smartphones, notebooks – tudo para mantê-lo conectado.\n2. Móveis e Decoração: Transforme sua casa em um lar aconchegante com nossos móveis e acessórios.\n3. Presentes Inesquecíveis: Surpreenda quem você ama com nossas opções de presentes.\n4. Compras Online Simples e Seguras: Navegue em nosso site e receba suas compras onde preferir.\n\nA Magazine Luiza é mais que uma loja; é um lugar onde sonhos se tornam realidade. Visite-nos hoje mesmo! 🌟",
    },
  ];

  return (
    <ScrollView>
      <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <View style={{ width: width, alignItems: "center" }}>
          <Swiper
            activeDotColor={"#FFFB00"}
            style={{ height: width / 2 }}
            showsPagination={true}
            showsButtons={false}
            autoplayTimeout={2.3}
            autoplay={true}
            autoplayDirection={true}
          >
            {dataBanner.map((data, index) => {
              return (
                <Link
                  href={{
                    pathname: "/Patrocinadores/[id]",
                    params: {
                      id: data.id,
                      category: data.category,
                      tittle: data.tittle,
                      img: data.img,
                      text: data.text,
                    },
                  }}
                  asChild
                >
                  <TouchableOpacity>
                    <Image
                      key={index}
                      index
                      style={styles.imageBanner}
                      resizeMode="stretch"
                      source={{ uri: data.img }}
                    />
                  </TouchableOpacity>
                </Link>
              );
            })}
          </Swiper>
          <View style={{ height: 20 }} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  imageBanner: {
    height: "100%",
    width: width - 40,
    borderRadius: 20,
    marginHorizontal: 20,
  },
});
