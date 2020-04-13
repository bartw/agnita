# Agnita: Authentication for Create React App using AWS Cognito

The Agnita project is a proof of concept implementation using [Amazon Cognito](https://aws.amazon.com/cognito/) and [create-react-app](https://create-react-app.dev/).

The name Agnita comes from Latin and means recognized. The name was chosen in close relation to Cognito. Finding a suitable name took me quite some time and is utterly useless.

## Medium

https://medium.com/@bartwijnants/agnita-authentication-for-create-react-app-using-aws-cognito-80cde1fb781b

## Setting up AWS Cognito

Make sure you have an AWS account, I suggest you use the [free tier](https://aws.amazon.com/free/) to get started.
Go to the [Cognito](https://console.aws.amazon.com/cognito/) service in the [AWS Management Console](https://console.aws.amazon.com/console) and click on Manage User Pools.

![Manage User Pools](images/01-Cognito.png)

Now click on Create a user pool to create your first user pool.

![Create A User Pool](images/02-Create-User-Pool.png)

In the next step you have to give your user pool a name, I named mine Agnita because, well, that's the name of my app. By clicking on Review Defaults you trust on AWS Cognito to make most of the hard choices in the settings. For a proof of concept I sure hope the defaults will be sufficient.

![Review Defaults](images/03-Review-Defaults.png)

As far as I know, those defaults look good. Since you are reading this, you probably don't have a clue either. So you can click on Create pool and see your first AWS Cognito user pool.

![Create Pool](images/04-Create-Pool.png)

Back to the [Cognito](https://console.aws.amazon.com/cognito/) service in the [AWS Management Console](https://console.aws.amazon.com/console) but this time you click on Manage Identity Pools.

![Manage Identity Pools](images/01-Cognito.png)

Time to come up with another name, I just went with Agnita again. You can ignore the Unauthenticated identities and the Authentication flow settings. But you should expand the Authentication providers.

The first Authentication-providers-tab is Cognito and you can fill in the User Pool ID of the User Pool you just created in there. But an App client id is also required. What I did was open another browser tab to create an App client.

![Create Pool](images/05-Create-Identity-Pool.png)

If you once again go to Cognito, I'm not going to put that screenshot up again, and then Manage User Pools you can select your User Pool. Under General Settings there is an option App clients. I think that's where you can create that much needed App Client.

![General Settings](images/06-General-Settings.png)

Looks like I was right. You can click Add an app client.

![Add App Client](images/07-Add-App-Client.png)

Guess what name I chose for my app client? That's right Agnita but I added -Web just because. You should also disable the Generate client secret checkbox. I left all other settings alone, so you can do that too, and I clicked Create app client.

![Create App Client](images/08-Create-App-Client.png)

Now you can continue with the identity pool. Paste your id's and hit Create Pool!

An unexpected screen appeared. Apparently you also need to specify at least one role. I guess that makes sense. I'm only interested in one kind of authenticated user so I'm going to keep it simple.

![Create Pool](images/09-Identify-Roles.png)

That did the trick. Now you can start using Cognito from a website.

## Setting up Create React App

Make sure you have [Node.js](https://nodejs.org/) installed. I also like to use [Visual Studio Code](https://code.visualstudio.com/) because it works.

Open a terminal and start typing like a madman.

```shell
npx create-react-app agnita
cd agnita
code .
```

If everything went well you should be in Visual Studio Code with your just generated create-react-app ready for action.

### Prettier detour

Before I can start working on a JavaScript project I always make sure [Prettier](https://prettier.io/) is installed. It's just so much faster to code if you can auto-format every 3.8 seconds.

When I'm in Visual Studio Code I always use the built in terminal. You can show the integrated terminal by using the ⌃` (control + backtick) shortcut when you're on [macOS](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-macos.pdf) like me. The same Visual Studio keyboard shortcut also exists for [Windows](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf) and [Linux](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-linux.pdf).

Now back to Prettier. After installing Prettier and creating an empty config you can hit ⇧⌥F (shift + command + f) when you are working in a file to format it.

```shell
npm install --save-dev prettier
echo "{}" >> .prettierrc
```

### Back on track

Just to be sure everything went right before you start integrating AWS Cognito, you can start the generated app. Back to the terminal:

```shell
npm start
```

I don't know about you but for me this opened up a browser tab and showed a spinning [React](https://reactjs.org/) logo.

### AWS Amplify

To register, log in and log out using AWS Cognito you need [AWS Amplify](https://aws-amplify.github.io/). AWS Amplify is a full fledged library to build apps on AWS. I'm only going to use AWS Cognito for now so I mainly focus on the [Manual Setup](https://aws-amplify.github.io/docs/js/authentication#manual-setup) part of the documentation.

```shell
npm install --save aws-amplify
```

You will need the Region, User Pool ID and App Client ID of Cognito in your React app. The `.env` file is where you should save those AWS Cognito id's. It's best not to check those in because other people might start using your user pool to store their users. So make sure to add `.env` to your `.gitignore` to exclude it from Git.

You do know [Git](https://git-scm.com/) do you? If you don't, you should learn it, just read the first 3 chapters of [this free book](https://git-scm.com/book/en/v2).

```shell
touch .env
```

Your `.env` file should look something like the one below. The `REACT_APP_` prefix is mandatory for Create-React-App to pick up your [environment variables](https://create-react-app.dev/docs/adding-custom-environment-variables/).

> I used an unbreakable algorithm to change all the id's so don't try anything. Actually I just typed in some random characters instead of the real id but it will get the job done.

```
REACT_APP_REGION=us-east-1
REACT_APP_USER_POOL_ID=us-east-1_SW382wGyU
REACT_APP_USER_POOL_WEB_CLIENT_ID=4t3RdWfp5ydwadefjthscrdrcd
```

Everything is in place to integrate AWS Cognito into your Create-React-App app. So you can start reacting. I added some css and a `FormElement` component to make it look a little (really just a little) better. You can check out those changes in the full code.

First you need to initialize AWS Amplify. I did that in my `App` component. I used the [useEffect](https://reactjs.org/docs/hooks-effect.html) hook to initialize AWS Amplify when my `App` component mounts.

```js
import React, { useEffect } from "react";
import Amplify from "aws-amplify";
import logo from "./logo.svg";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import "./App.css";

const App = () => {
  useEffect(() => {
    Amplify.configure({
      Auth: {
        region: process.env.REACT_APP_REGION,
        userPoolId: process.env.REACT_APP_USER_POOL_ID,
        userPoolWebClientId: process.env.REACT_APP_USER_POOL_WEB_CLIENT_ID,
      },
    });
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Agnita</h1>
        <h2>Authentication for Create React App using AWS Cognito</h2>
      </header>
      <SignUp />
      <SignIn />
    </div>
  );
};

export default App;
```

You can see I created a `SignUp` and a `SignIn` component. These are 2 quite similar forms that use the AWS Amplify Auth API to create new users and sign in with those users. Now this app doesn't do anything so you should keep your browser console open to see if stuff works.

The `SignUp` component consists of 2 forms. In the first form you need to fill in an email address and a password. When you submit, a user will be created with your email as the username and as email also your email and your password. If everything goes smooth, the second form will become visible. The second form requires you to enter a confirmation code. This code should be emailed to you after the first step. After you submit your confirmation code you will have a registered user.

```js
import React, { useState } from "react";
import { Auth } from "aws-amplify";
import FormElement from "./FormElement";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [waitingForCode, setWaitingForCode] = useState(false);
  const [code, setCode] = useState("");

  const signUp = (e) => {
    e.preventDefault();

    Auth.signUp({ username: email, password, attributes: { email } })
      .then((data) => {
        console.log(data);
        setWaitingForCode(true);
        setPassword("");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const confirmSignUp = (e) => {
    e.preventDefault();

    Auth.confirmSignUp(email, code)
      .then((data) => {
        console.log(data);
        setWaitingForCode(false);
        setEmail("");
        setCode("");
      })
      .catch((err) => console.log(err));
  };

  const resendCode = () => {
    Auth.resendSignUp(email)
      .then(() => {
        console.log("code resent successfully");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className="form">
      <h3>Sign Up</h3>
      {!waitingForCode && (
        <form>
          <FormElement label="Email" forId="sign-up-email">
            <input
              id="sign-up-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email"
            />
          </FormElement>
          <FormElement label="Password" forId="sign-up-email">
            <input
              id="sign-up-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
            />
          </FormElement>
          <button type="submit" onClick={signUp}>
            Sign Up
          </button>
        </form>
      )}
      {waitingForCode && (
        <form>
          <FormElement label="Confirmation Code" forId="sign-up-code">
            <input
              id="sign-up-code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="code"
            />
          </FormElement>
          <button type="submit" onClick={confirmSignUp}>
            Confirm Sign Up
          </button>
          <button type="button" onClick={resendCode}>
            Resend code
          </button>
        </form>
      )}
    </div>
  );
};

export default SignUp;
```

When you have a registered user, you can use the email and password of that user in the `SignIn` form. Just fill in de email and the password and click on login and you will see a log in the console with the user information.

```js
import React, { useState } from "react";
import { Auth } from "aws-amplify";
import FormElement from "./FormElement";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = (e) => {
    e.preventDefault();

    Auth.signIn({
      username: email,
      password,
    })
      .then((user) => {
        setEmail("");
        setPassword("");
        console.log(user);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="form">
      <h3>Sign In</h3>
      <form>
        <FormElement label="Email" forId="sign-in-email">
          <input
            id="sign-in-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
          />
        </FormElement>
        <FormElement label="Password" forId="sign-in-password">
          <input
            id="sign-in-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
          />
        </FormElement>
        <button type="submit" onClick={signIn}>
          Sign In
        </button>
      </form>
    </div>
  );
};

export default SignIn;
```

Turns out creating using AWS Cognito to add authentication to Create-React-App isn't that hard. I hope you can also pull it off.

This proof of concept can use a lot of follow up content: deploying to multiple environments, use it in a real app with private and public parts and adding third party authentication providers like Facebook are the first that spring to mind. Maybe I'll find the motivation to try and write those up too.

## License

This repo is licensed under the [MIT License](LICENSE).