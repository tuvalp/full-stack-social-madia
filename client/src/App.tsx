import Error from "./compents/Error";
import { ErrorProvider } from "./contexts/ErrorContext";
import Auth from "./compents/Auth/Auth";
import { UserProvider, useUserContext } from "./contexts/UsersCotext";
import Main from "./compents/Main/Main";
import { PostProvider } from "./contexts/PostContext";
import { CommentProvider } from "./contexts/CommentContex";
import { LikeProvider } from "./contexts/LikeContext";
import { ActivityProvider } from "./contexts/ActivityContext";

// The main screen logic
const Screen = () => {
  const { currentUser } = useUserContext();

  return currentUser?.email ? <Main /> : <Auth />;
};

// App component with providers
function App() {
  return (
    <div className="app">
      <ErrorProvider>
        <UserProvider>
          <ActivityProvider>
            <PostProvider>
              <CommentProvider>
                <LikeProvider>
                  <Error />
                  <Screen />
                </LikeProvider>
              </CommentProvider>
            </PostProvider>
          </ActivityProvider>
        </UserProvider>
      </ErrorProvider>
    </div>
  );
}

export default App;
