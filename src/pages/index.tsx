import { ChatLayout } from "~/layouts/chat";
import { MainLayout } from "~/layouts/main";
import { type NextPageWithLayout } from "./_app";

const HomePage: NextPageWithLayout = () => {
  return (
    <main className="hidden place-items-center bg-secondary md:grid">
      <p>Выберите, кому хотели бы написать</p>
    </main>
  );
};

HomePage.getLayout = (page) => (
  <MainLayout>
    <ChatLayout>{page}</ChatLayout>
  </MainLayout>
);

export default HomePage;
