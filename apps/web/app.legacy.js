(() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // apps/web/i18n.js
  var dictionaries = {
    ru: {
      login: "\u0412\u043E\u0439\u0442\u0438",
      register: "\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F",
      displayName: "\u0418\u043C\u044F",
      password: "\u041F\u0430\u0440\u043E\u043B\u044C",
      searchChats: "\u041F\u043E\u0438\u0441\u043A",
      selectChat: "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0447\u0430\u0442",
      selectChatHint: "\u0438\u043B\u0438 \u0441\u043E\u0437\u0434\u0430\u0439\u0442\u0435 \u043D\u043E\u0432\u044B\u0439 \u0434\u0438\u0430\u043B\u043E\u0433",
      offline: "\u043D\u0435 \u0432 \u0441\u0435\u0442\u0438",
      online: "\u0432 \u0441\u0435\u0442\u0438",
      message: "\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435",
      settings: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438",
      language: "\u042F\u0437\u044B\u043A",
      privacy: "\u041A\u043E\u043D\u0444\u0438\u0434\u0435\u043D\u0446\u0438\u0430\u043B\u044C\u043D\u043E\u0441\u0442\u044C",
      encryptionNote: "\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044F \u0438 \u0432\u043B\u043E\u0436\u0435\u043D\u0438\u044F \u0448\u0438\u0444\u0440\u0443\u044E\u0442\u0441\u044F \u0432 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0435 \u0434\u043E \u043E\u0442\u043F\u0440\u0430\u0432\u043A\u0438 \u043D\u0430 \u0441\u0435\u0440\u0432\u0435\u0440.",
      newChat: "\u041D\u043E\u0432\u044B\u0439 \u0447\u0430\u0442",
      newChatHint: "\u0421\u043E\u0437\u0434\u0430\u0439\u0442\u0435 \u043F\u0440\u0438\u0432\u0430\u0442\u043D\u0443\u044E \u0441\u0441\u044B\u043B\u043A\u0443-\u043F\u0440\u0438\u0433\u043B\u0430\u0448\u0435\u043D\u0438\u0435.",
      chatType: "\u0422\u0438\u043F \u0447\u0430\u0442\u0430",
      directChat: "\u041B\u0438\u0447\u043D\u044B\u0439 \u0447\u0430\u0442",
      groupChat: "\u0413\u0440\u0443\u043F\u043F\u0430",
      channel: "\u041A\u0430\u043D\u0430\u043B",
      groupName: "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435",
      description: "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435",
      descriptionPlaceholder: "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0433\u0440\u0443\u043F\u043F\u044B \u0438\u043B\u0438 \u043A\u0430\u043D\u0430\u043B\u0430",
      groupCreateHint: "\u0413\u0440\u0443\u043F\u043F\u0430 \u0441\u043E\u0437\u0434\u0430\u0451\u0442\u0441\u044F \u0441\u0440\u0430\u0437\u0443. \u0423\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u043E\u0432 \u043F\u043E\u0442\u043E\u043C \u043C\u043E\u0436\u043D\u043E \u043F\u0440\u0438\u0433\u043B\u0430\u0441\u0438\u0442\u044C \u0441\u0441\u044B\u043B\u043A\u043E\u0439.",
      channelCreateHint: "\u041A\u0430\u043D\u0430\u043B \u0441\u043E\u0437\u0434\u0430\u0451\u0442\u0441\u044F \u0441\u0440\u0430\u0437\u0443. \u041F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u0442\u044C \u043C\u043E\u0433\u0443\u0442 \u0432\u043B\u0430\u0434\u0435\u043B\u0435\u0446 \u0438 \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u044B.",
      createGroup: "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0433\u0440\u0443\u043F\u043F\u0443",
      createChannel: "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u043A\u0430\u043D\u0430\u043B",
      channelReadOnly: "\u041F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u0442\u044C \u043C\u043E\u0433\u0443\u0442 \u0442\u043E\u043B\u044C\u043A\u043E \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u044B",
      invitePeople: "\u041F\u0440\u0438\u0433\u043B\u0430\u0441\u0438\u0442\u044C",
      editChat: "\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C",
      membersTitle: "\u0423\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u0438",
      leaveChat: "\u041F\u043E\u043A\u0438\u043D\u0443\u0442\u044C",
      comments: "\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0438",
      commentPlaceholder: "\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439",
      reply: "\u041E\u0442\u0432\u0435\u0442\u0438\u0442\u044C",
      edit: "\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C",
      delete: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C",
      pin: "\u0417\u0430\u043A\u0440\u0435\u043F\u0438\u0442\u044C",
      unpin: "\u041E\u0442\u043A\u0440\u0435\u043F\u0438\u0442\u044C",
      edited: "\u0438\u0437\u043C\u0435\u043D\u0435\u043D\u043E",
      messageDeleted: "\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435 \u0443\u0434\u0430\u043B\u0435\u043D\u043E",
      admin: "\u0410\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440",
      owner: "\u0412\u043B\u0430\u0434\u0435\u043B\u0435\u0446",
      subscriber: "\u041F\u043E\u0434\u043F\u0438\u0441\u0447\u0438\u043A",
      member: "\u0423\u0447\u0430\u0441\u0442\u043D\u0438\u043A",
      makeAdmin: "\u0421\u0434\u0435\u043B\u0430\u0442\u044C \u0430\u0434\u043C\u0438\u043D\u043E\u043C",
      removeAdmin: "\u0423\u0431\u0440\u0430\u0442\u044C \u0430\u0434\u043C\u0438\u043D\u0430",
      removeMember: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C",
      typing: "\u043F\u0435\u0447\u0430\u0442\u0430\u0435\u0442\u2026",
      newGroupCreated: "\u0413\u0440\u0443\u043F\u043F\u0430 \u0441\u043E\u0437\u0434\u0430\u043D\u0430",
      newChannelCreated: "\u041A\u0430\u043D\u0430\u043B \u0441\u043E\u0437\u0434\u0430\u043D",
      commentsDisabled: "\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0438 \u043E\u0442\u043A\u043B\u044E\u0447\u0435\u043D\u044B",
      save: "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C",
      notifications: "\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F",
      enableNotifications: "\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F",
      notificationsEnabled: "\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F \u0432\u043A\u043B\u044E\u0447\u0435\u043D\u044B",
      muteChat: "\u0412\u044B\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F",
      unmuteChat: "\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F",
      disableComments: "\u041E\u0442\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0438",
      enableComments: "\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0438",
      newMessageNotification: "\u041D\u043E\u0432\u043E\u0435 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435",
      groupNamePlaceholder: "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0433\u0440\u0443\u043F\u043F\u044B",
      invitePrivacyHint: "Email \u0441\u043E\u0431\u0435\u0441\u0435\u0434\u043D\u0438\u043A\u0430 \u043D\u0435 \u043D\u0443\u0436\u0435\u043D. \u041E\u0442\u043F\u0440\u0430\u0432\u044C\u0442\u0435 \u0435\u043C\u0443 \u0441\u0441\u044B\u043B\u043A\u0443 \u2014 \u043F\u043E\u0441\u043B\u0435 \u0432\u0445\u043E\u0434\u0430 \u0438\u043B\u0438 \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u0438 \u043E\u043D \u0441\u0440\u0430\u0437\u0443 \u043F\u043E\u043F\u0430\u0434\u0451\u0442 \u0432 \u0447\u0430\u0442.",
      createInvite: "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0441\u0441\u044B\u043B\u043A\u0443",
      createAnotherInvite: "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0434\u0440\u0443\u0433\u0443\u044E \u0441\u0441\u044B\u043B\u043A\u0443",
      copyLink: "\u041A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0441\u0441\u044B\u043B\u043A\u0443",
      linkCopied: "\u0421\u0441\u044B\u043B\u043A\u0430 \u0441\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u0430",
      inviteAfterAuth: "\u0412\u043E\u0439\u0434\u0438\u0442\u0435 \u0438\u043B\u0438 \u0437\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u0443\u0439\u0442\u0435\u0441\u044C \u2014 \u043F\u0440\u0438\u0433\u043B\u0430\u0448\u0435\u043D\u0438\u0435 \u043E\u0442\u043A\u0440\u043E\u0435\u0442\u0441\u044F \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438.",
      inviteAccepted: "\u0412\u044B \u043F\u0440\u0438\u0441\u043E\u0435\u0434\u0438\u043D\u0438\u043B\u0438\u0441\u044C \u043A \u0447\u0430\u0442\u0443",
      inviteInvalid: "\u041F\u0440\u0438\u0433\u043B\u0430\u0448\u0435\u043D\u0438\u0435 \u043D\u0435\u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u044C\u043D\u043E, \u043F\u0440\u043E\u0441\u0440\u043E\u0447\u0435\u043D\u043E \u0438\u043B\u0438 \u0443\u0436\u0435 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u043E",
      inviteCreateFailed: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u043E\u0437\u0434\u0430\u0442\u044C \u043F\u0440\u0438\u0433\u043B\u0430\u0448\u0435\u043D\u0438\u0435",
      ownInvite: "\u042D\u0442\u043E \u0432\u0430\u0448\u0430 \u0441\u043E\u0431\u0441\u0442\u0432\u0435\u043D\u043D\u0430\u044F \u0441\u0441\u044B\u043B\u043A\u0430-\u043F\u0440\u0438\u0433\u043B\u0430\u0448\u0435\u043D\u0438\u0435",
      groupNameRequired: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0433\u0440\u0443\u043F\u043F\u044B",
      verificationCode: "\u041A\u043E\u0434 \u0438\u0437 \u043F\u0438\u0441\u044C\u043C\u0430",
      verifyAndRegister: "\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C \u0438 \u0437\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F",
      verificationSent: "\u041A\u043E\u0434 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D \u043D\u0430 \u043F\u043E\u0447\u0442\u0443. \u041E\u043D \u0434\u0435\u0439\u0441\u0442\u0432\u0443\u0435\u0442 10 \u043C\u0438\u043D\u0443\u0442.",
      verificationInvalid: "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0438\u043B\u0438 \u043F\u0440\u043E\u0441\u0440\u043E\u0447\u0435\u043D\u043D\u044B\u0439 \u043A\u043E\u0434",
      mailUnavailable: "\u041E\u0442\u043F\u0440\u0430\u0432\u043A\u0430 \u043F\u0438\u0441\u0435\u043C \u043F\u043E\u043A\u0430 \u043D\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043D\u0430 \u043D\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0435",
      speaker: "\u0414\u0438\u043D\u0430\u043C\u0438\u043A",
      earpiece: "\u0420\u0430\u0437\u0433\u043E\u0432\u043E\u0440\u043D\u044B\u0439 \u0434\u0438\u043D\u0430\u043C\u0438\u043A",
      microphone: "\u041C\u0438\u043A\u0440\u043E\u0444\u043E\u043D",
      camera: "\u041A\u0430\u043C\u0435\u0440\u0430",
      shareScreen: "\u0414\u0435\u043C\u043E\u043D\u0441\u0442\u0440\u0430\u0446\u0438\u044F \u044D\u043A\u0440\u0430\u043D\u0430",
      incomingCall: "\u0412\u0445\u043E\u0434\u044F\u0449\u0438\u0439 \u0437\u0432\u043E\u043D\u043E\u043A",
      audioCall: "\u0410\u0443\u0434\u0438\u043E\u0437\u0432\u043E\u043D\u043E\u043A",
      videoCall: "\u0412\u0438\u0434\u0435\u043E\u0437\u0432\u043E\u043D\u043E\u043A",
      calling: "\u0432\u044B\u0437\u043E\u0432\u2026",
      connecting: "\u0441\u043E\u0435\u0434\u0438\u043D\u0435\u043D\u0438\u0435\u2026",
      inCall: "\u0432 \u0437\u0432\u043E\u043D\u043A\u0435",
      callEnded: "\u0417\u0432\u043E\u043D\u043E\u043A \u0437\u0430\u0432\u0435\u0440\u0448\u0451\u043D",
      callDeclined: "\u0417\u0432\u043E\u043D\u043E\u043A \u043E\u0442\u043A\u043B\u043E\u043D\u0451\u043D",
      peerDisconnected: "\u0421\u043E\u0431\u0435\u0441\u0435\u0434\u043D\u0438\u043A \u043E\u0442\u043A\u043B\u044E\u0447\u0438\u043B\u0441\u044F",
      noCamera: "\u041A\u0430\u043C\u0435\u0440\u0430 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0430 \u2014 \u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0430\u0435\u043C \u0442\u043E\u043B\u044C\u043A\u043E \u0441 \u043C\u0438\u043A\u0440\u043E\u0444\u043E\u043D\u043E\u043C",
      allowMicrophone: "\u0420\u0430\u0437\u0440\u0435\u0448\u0438\u0442\u0435 \u0434\u043E\u0441\u0442\u0443\u043F \u043A \u043C\u0438\u043A\u0440\u043E\u0444\u043E\u043D\u0443",
      shareUnsupported: "\u0414\u0435\u043C\u043E\u043D\u0441\u0442\u0440\u0430\u0446\u0438\u044F \u044D\u043A\u0440\u0430\u043D\u0430 \u043D\u0435 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442\u0441\u044F \u043D\u0430 \u044D\u0442\u043E\u043C \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0435",
      outputUnsupported: "\u041F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u0430\u0443\u0434\u0438\u043E\u0432\u044B\u0445\u043E\u0434\u0430 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E \u0432 \u044D\u0442\u043E\u043C \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0435",
      emailExists: "\u042D\u0442\u043E\u0442 email \u0443\u0436\u0435 \u0437\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u043D",
      invalidCredentials: "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 email \u0438\u043B\u0438 \u043F\u0430\u0440\u043E\u043B\u044C",
      invalidRegistration: "\u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0438\u043C\u044F, email \u0438 \u043F\u0430\u0440\u043E\u043B\u044C (\u043C\u0438\u043D\u0438\u043C\u0443\u043C 8 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432)",
      serverError: "\u0421\u0435\u0440\u0432\u0435\u0440 \u0432\u0440\u0435\u043C\u0435\u043D\u043D\u043E \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D",
      chatCreateFailed: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u043E\u0437\u0434\u0430\u0442\u044C \u0447\u0430\u0442",
      encrypted: "\u0417\u0430\u0448\u0438\u0444\u0440\u043E\u0432\u0430\u043D\u043E",
      photo: "\u0424\u043E\u0442\u043E",
      file: "\u0424\u0430\u0439\u043B",
      download: "\u0421\u043A\u0430\u0447\u0430\u0442\u044C",
      imageTooLarge: "\u0424\u0430\u0439\u043B \u0441\u043B\u0438\u0448\u043A\u043E\u043C \u0431\u043E\u043B\u044C\u0448\u043E\u0439",
      logout: "\u0412\u044B\u0439\u0442\u0438",
      noChats: "\u0427\u0430\u0442\u043E\u0432 \u043F\u043E\u043A\u0430 \u043D\u0435\u0442",
      noChatsHint: "\u041D\u0430\u0436\u043C\u0438\u0442\u0435 \u270E, \u0447\u0442\u043E\u0431\u044B \u043D\u0430\u0447\u0430\u0442\u044C \u0434\u0438\u0430\u043B\u043E\u0433",
      group: "\u0413\u0440\u0443\u043F\u043F\u0430",
      members: "\u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u043E\u0432",
      you: "\u0412\u044B",
      today: "\u0421\u0435\u0433\u043E\u0434\u043D\u044F",
      yesterday: "\u0412\u0447\u0435\u0440\u0430",
      install: "\u0423\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C M0D",
      cryptoError: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0442\u043A\u0440\u044B\u0442\u044C \u043A\u043B\u044E\u0447\u0438 \u0448\u0438\u0444\u0440\u043E\u0432\u0430\u043D\u0438\u044F \u044D\u0442\u043E\u0433\u043E \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430 \u043D\u0430 \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0435",
      sessionExpired: "\u0421\u0435\u0441\u0441\u0438\u044F \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0430. \u0412\u043E\u0439\u0434\u0438\u0442\u0435 \u0441\u043D\u043E\u0432\u0430."
    },
    en: {
      login: "Log in",
      register: "Register",
      displayName: "Name",
      password: "Password",
      searchChats: "Search",
      selectChat: "Select a chat",
      selectChatHint: "or start a new conversation",
      offline: "offline",
      online: "online",
      message: "Message",
      settings: "Settings",
      language: "Language",
      privacy: "Privacy",
      encryptionNote: "Messages and attachments are encrypted in the browser before being sent to the server.",
      newChat: "New chat",
      newChatHint: "Create a private invitation link.",
      chatType: "Chat type",
      directChat: "Direct chat",
      groupChat: "Group",
      channel: "Channel",
      groupName: "Name",
      description: "Description",
      descriptionPlaceholder: "Group or channel description",
      groupCreateHint: "The group is created immediately. Invite people later with a link.",
      channelCreateHint: "The channel is created immediately. Only the owner and admins can publish.",
      createGroup: "Create group",
      createChannel: "Create channel",
      channelReadOnly: "Only administrators can publish",
      invitePeople: "Invite",
      editChat: "Edit",
      membersTitle: "Members",
      leaveChat: "Leave",
      comments: "Comments",
      commentPlaceholder: "Comment",
      reply: "Reply",
      edit: "Edit",
      delete: "Delete",
      pin: "Pin",
      unpin: "Unpin",
      edited: "edited",
      messageDeleted: "Message deleted",
      admin: "Administrator",
      owner: "Owner",
      subscriber: "Subscriber",
      member: "Member",
      makeAdmin: "Make admin",
      removeAdmin: "Remove admin",
      removeMember: "Remove",
      typing: "typing\u2026",
      newGroupCreated: "Group created",
      newChannelCreated: "Channel created",
      commentsDisabled: "Comments are disabled",
      save: "Save",
      notifications: "Notifications",
      enableNotifications: "Enable notifications",
      notificationsEnabled: "Notifications enabled",
      muteChat: "Mute",
      unmuteChat: "Unmute",
      disableComments: "Disable comments",
      enableComments: "Enable comments",
      newMessageNotification: "New message",
      groupNamePlaceholder: "Group name",
      invitePrivacyHint: "You do not need the other person's email. Send the link; after login or registration they will join the chat automatically.",
      createInvite: "Create link",
      createAnotherInvite: "Create another link",
      copyLink: "Copy link",
      linkCopied: "Link copied",
      inviteAfterAuth: "Log in or register \u2014 the invitation will open automatically.",
      inviteAccepted: "You joined the chat",
      inviteInvalid: "The invitation is invalid, expired, or already used",
      inviteCreateFailed: "Could not create the invitation",
      ownInvite: "This is your own invitation link",
      groupNameRequired: "Enter a group name",
      verificationCode: "Email code",
      verifyAndRegister: "Verify and register",
      verificationSent: "A code was sent to your email. It expires in 10 minutes.",
      verificationInvalid: "The code is invalid or expired",
      mailUnavailable: "Email delivery is not configured on the server yet",
      speaker: "Speaker",
      earpiece: "Earpiece",
      microphone: "Microphone",
      camera: "Camera",
      shareScreen: "Share screen",
      incomingCall: "Incoming call",
      audioCall: "Audio call",
      videoCall: "Video call",
      calling: "calling\u2026",
      connecting: "connecting\u2026",
      inCall: "in call",
      callEnded: "Call ended",
      callDeclined: "Call declined",
      peerDisconnected: "The other person disconnected",
      noCamera: "Camera is unavailable \u2014 continuing with microphone only",
      allowMicrophone: "Allow microphone access",
      shareUnsupported: "Screen sharing is not supported on this device",
      outputUnsupported: "Audio output switching is not supported in this browser",
      emailExists: "This email is already registered",
      invalidCredentials: "Invalid email or password",
      invalidRegistration: "Check your name, email and password (at least 8 characters)",
      serverError: "The server is temporarily unavailable",
      chatCreateFailed: "Could not create the chat",
      encrypted: "Encrypted",
      photo: "Photo",
      file: "File",
      download: "Download",
      imageTooLarge: "The file is too large",
      logout: "Log out",
      noChats: "No chats yet",
      noChatsHint: "Press \u270E to start a conversation",
      group: "Group",
      members: "members",
      you: "You",
      today: "Today",
      yesterday: "Yesterday",
      install: "Install M0D",
      cryptoError: "Could not unlock this account's encryption keys on this device",
      sessionExpired: "Your session ended. Log in again."
    },
    uk: {
      login: "\u0423\u0432\u0456\u0439\u0442\u0438",
      register: "\u0420\u0435\u0454\u0441\u0442\u0440\u0430\u0446\u0456\u044F",
      displayName: "\u0406\u043C'\u044F",
      password: "\u041F\u0430\u0440\u043E\u043B\u044C",
      searchChats: "\u041F\u043E\u0448\u0443\u043A",
      selectChat: "\u0412\u0438\u0431\u0435\u0440\u0456\u0442\u044C \u0447\u0430\u0442",
      selectChatHint: "\u0430\u0431\u043E \u0441\u0442\u0432\u043E\u0440\u0456\u0442\u044C \u043D\u043E\u0432\u0438\u0439 \u0434\u0456\u0430\u043B\u043E\u0433",
      offline: "\u043D\u0435 \u0432 \u043C\u0435\u0440\u0435\u0436\u0456",
      online: "\u0432 \u043C\u0435\u0440\u0435\u0436\u0456",
      message: "\u041F\u043E\u0432\u0456\u0434\u043E\u043C\u043B\u0435\u043D\u043D\u044F",
      settings: "\u041D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F",
      language: "\u041C\u043E\u0432\u0430",
      privacy: "\u041A\u043E\u043D\u0444\u0456\u0434\u0435\u043D\u0446\u0456\u0439\u043D\u0456\u0441\u0442\u044C",
      encryptionNote: "\u041F\u043E\u0432\u0456\u0434\u043E\u043C\u043B\u0435\u043D\u043D\u044F \u0442\u0430 \u0432\u043A\u043B\u0430\u0434\u0435\u043D\u043D\u044F \u0448\u0438\u0444\u0440\u0443\u044E\u0442\u044C\u0441\u044F \u0443 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0456 \u0434\u043E \u0432\u0456\u0434\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043D\u044F \u043D\u0430 \u0441\u0435\u0440\u0432\u0435\u0440.",
      newChat: "\u041D\u043E\u0432\u0438\u0439 \u0447\u0430\u0442",
      newChatHint: "\u0421\u0442\u0432\u043E\u0440\u0456\u0442\u044C \u043F\u0440\u0438\u0432\u0430\u0442\u043D\u0435 \u043F\u043E\u0441\u0438\u043B\u0430\u043D\u043D\u044F-\u0437\u0430\u043F\u0440\u043E\u0448\u0435\u043D\u043D\u044F.",
      chatType: "\u0422\u0438\u043F \u0447\u0430\u0442\u0443",
      directChat: "\u041E\u0441\u043E\u0431\u0438\u0441\u0442\u0438\u0439 \u0447\u0430\u0442",
      groupChat: "\u0413\u0440\u0443\u043F\u0430",
      channel: "\u041A\u0430\u043D\u0430\u043B",
      groupName: "\u041D\u0430\u0437\u0432\u0430",
      description: "\u041E\u043F\u0438\u0441",
      descriptionPlaceholder: "\u041E\u043F\u0438\u0441 \u0433\u0440\u0443\u043F\u0438 \u0430\u0431\u043E \u043A\u0430\u043D\u0430\u043B\u0443",
      groupCreateHint: "\u0413\u0440\u0443\u043F\u0430 \u0441\u0442\u0432\u043E\u0440\u044E\u0454\u0442\u044C\u0441\u044F \u043E\u0434\u0440\u0430\u0437\u0443. \u0423\u0447\u0430\u0441\u043D\u0438\u043A\u0456\u0432 \u043F\u043E\u0442\u0456\u043C \u043C\u043E\u0436\u043D\u0430 \u0437\u0430\u043F\u0440\u043E\u0441\u0438\u0442\u0438 \u043F\u043E\u0441\u0438\u043B\u0430\u043D\u043D\u044F\u043C.",
      channelCreateHint: "\u041A\u0430\u043D\u0430\u043B \u0441\u0442\u0432\u043E\u0440\u044E\u0454\u0442\u044C\u0441\u044F \u043E\u0434\u0440\u0430\u0437\u0443. \u041F\u0443\u0431\u043B\u0456\u043A\u0443\u0432\u0430\u0442\u0438 \u043C\u043E\u0436\u0443\u0442\u044C \u0432\u043B\u0430\u0441\u043D\u0438\u043A \u0456 \u0430\u0434\u043C\u0456\u043D\u0456\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u0438.",
      createGroup: "\u0421\u0442\u0432\u043E\u0440\u0438\u0442\u0438 \u0433\u0440\u0443\u043F\u0443",
      createChannel: "\u0421\u0442\u0432\u043E\u0440\u0438\u0442\u0438 \u043A\u0430\u043D\u0430\u043B",
      channelReadOnly: "\u041F\u0443\u0431\u043B\u0456\u043A\u0443\u0432\u0430\u0442\u0438 \u043C\u043E\u0436\u0443\u0442\u044C \u043B\u0438\u0448\u0435 \u0430\u0434\u043C\u0456\u043D\u0456\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u0438",
      invitePeople: "\u0417\u0430\u043F\u0440\u043E\u0441\u0438\u0442\u0438",
      editChat: "\u0417\u043C\u0456\u043D\u0438\u0442\u0438",
      membersTitle: "\u0423\u0447\u0430\u0441\u043D\u0438\u043A\u0438",
      leaveChat: "\u041F\u043E\u043A\u0438\u043D\u0443\u0442\u0438",
      comments: "\u041A\u043E\u043C\u0435\u043D\u0442\u0430\u0440\u0456",
      commentPlaceholder: "\u041A\u043E\u043C\u0435\u043D\u0442\u0430\u0440",
      reply: "\u0412\u0456\u0434\u043F\u043E\u0432\u0456\u0441\u0442\u0438",
      edit: "\u0417\u043C\u0456\u043D\u0438\u0442\u0438",
      delete: "\u0412\u0438\u0434\u0430\u043B\u0438\u0442\u0438",
      pin: "\u0417\u0430\u043A\u0440\u0456\u043F\u0438\u0442\u0438",
      unpin: "\u0412\u0456\u0434\u043A\u0440\u0456\u043F\u0438\u0442\u0438",
      edited: "\u0437\u043C\u0456\u043D\u0435\u043D\u043E",
      messageDeleted: "\u041F\u043E\u0432\u0456\u0434\u043E\u043C\u043B\u0435\u043D\u043D\u044F \u0432\u0438\u0434\u0430\u043B\u0435\u043D\u043E",
      admin: "\u0410\u0434\u043C\u0456\u043D\u0456\u0441\u0442\u0440\u0430\u0442\u043E\u0440",
      owner: "\u0412\u043B\u0430\u0441\u043D\u0438\u043A",
      subscriber: "\u041F\u0456\u0434\u043F\u0438\u0441\u043D\u0438\u043A",
      member: "\u0423\u0447\u0430\u0441\u043D\u0438\u043A",
      makeAdmin: "\u0417\u0440\u043E\u0431\u0438\u0442\u0438 \u0430\u0434\u043C\u0456\u043D\u043E\u043C",
      removeAdmin: "\u041F\u0440\u0438\u0431\u0440\u0430\u0442\u0438 \u0430\u0434\u043C\u0456\u043D\u0430",
      removeMember: "\u0412\u0438\u0434\u0430\u043B\u0438\u0442\u0438",
      typing: "\u0434\u0440\u0443\u043A\u0443\u0454\u2026",
      newGroupCreated: "\u0413\u0440\u0443\u043F\u0443 \u0441\u0442\u0432\u043E\u0440\u0435\u043D\u043E",
      newChannelCreated: "\u041A\u0430\u043D\u0430\u043B \u0441\u0442\u0432\u043E\u0440\u0435\u043D\u043E",
      commentsDisabled: "\u041A\u043E\u043C\u0435\u043D\u0442\u0430\u0440\u0456 \u0432\u0438\u043C\u043A\u043D\u0435\u043D\u043E",
      save: "\u0417\u0431\u0435\u0440\u0435\u0433\u0442\u0438",
      notifications: "\u0421\u043F\u043E\u0432\u0456\u0449\u0435\u043D\u043D\u044F",
      enableNotifications: "\u0423\u0432\u0456\u043C\u043A\u043D\u0443\u0442\u0438 \u0441\u043F\u043E\u0432\u0456\u0449\u0435\u043D\u043D\u044F",
      notificationsEnabled: "\u0421\u043F\u043E\u0432\u0456\u0449\u0435\u043D\u043D\u044F \u0443\u0432\u0456\u043C\u043A\u043D\u0435\u043D\u043E",
      muteChat: "\u0412\u0438\u043C\u043A\u043D\u0443\u0442\u0438 \u0441\u043F\u043E\u0432\u0456\u0449\u0435\u043D\u043D\u044F",
      unmuteChat: "\u0423\u0432\u0456\u043C\u043A\u043D\u0443\u0442\u0438 \u0441\u043F\u043E\u0432\u0456\u0449\u0435\u043D\u043D\u044F",
      disableComments: "\u0412\u0438\u043C\u043A\u043D\u0443\u0442\u0438 \u043A\u043E\u043C\u0435\u043D\u0442\u0430\u0440\u0456",
      enableComments: "\u0423\u0432\u0456\u043C\u043A\u043D\u0443\u0442\u0438 \u043A\u043E\u043C\u0435\u043D\u0442\u0430\u0440\u0456",
      newMessageNotification: "\u041D\u043E\u0432\u0435 \u043F\u043E\u0432\u0456\u0434\u043E\u043C\u043B\u0435\u043D\u043D\u044F",
      groupNamePlaceholder: "\u041D\u0430\u0437\u0432\u0430 \u0433\u0440\u0443\u043F\u0438",
      invitePrivacyHint: "Email \u0441\u043F\u0456\u0432\u0440\u043E\u0437\u043C\u043E\u0432\u043D\u0438\u043A\u0430 \u043D\u0435 \u043F\u043E\u0442\u0440\u0456\u0431\u0435\u043D. \u041D\u0430\u0434\u0456\u0448\u043B\u0456\u0442\u044C \u0439\u043E\u043C\u0443 \u043F\u043E\u0441\u0438\u043B\u0430\u043D\u043D\u044F \u2014 \u043F\u0456\u0441\u043B\u044F \u0432\u0445\u043E\u0434\u0443 \u0430\u0431\u043E \u0440\u0435\u0454\u0441\u0442\u0440\u0430\u0446\u0456\u0457 \u0432\u0456\u043D \u043E\u0434\u0440\u0430\u0437\u0443 \u043F\u043E\u0442\u0440\u0430\u043F\u0438\u0442\u044C \u0443 \u0447\u0430\u0442.",
      createInvite: "\u0421\u0442\u0432\u043E\u0440\u0438\u0442\u0438 \u043F\u043E\u0441\u0438\u043B\u0430\u043D\u043D\u044F",
      createAnotherInvite: "\u0421\u0442\u0432\u043E\u0440\u0438\u0442\u0438 \u0456\u043D\u0448\u0435 \u043F\u043E\u0441\u0438\u043B\u0430\u043D\u043D\u044F",
      copyLink: "\u041A\u043E\u043F\u0456\u044E\u0432\u0430\u0442\u0438 \u043F\u043E\u0441\u0438\u043B\u0430\u043D\u043D\u044F",
      linkCopied: "\u041F\u043E\u0441\u0438\u043B\u0430\u043D\u043D\u044F \u0441\u043A\u043E\u043F\u0456\u0439\u043E\u0432\u0430\u043D\u043E",
      inviteAfterAuth: "\u0423\u0432\u0456\u0439\u0434\u0456\u0442\u044C \u0430\u0431\u043E \u0437\u0430\u0440\u0435\u0454\u0441\u0442\u0440\u0443\u0439\u0442\u0435\u0441\u044F \u2014 \u0437\u0430\u043F\u0440\u043E\u0448\u0435\u043D\u043D\u044F \u0432\u0456\u0434\u043A\u0440\u0438\u0454\u0442\u044C\u0441\u044F \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E.",
      inviteAccepted: "\u0412\u0438 \u043F\u0440\u0438\u0454\u0434\u043D\u0430\u043B\u0438\u0441\u044F \u0434\u043E \u0447\u0430\u0442\u0443",
      inviteInvalid: "\u0417\u0430\u043F\u0440\u043E\u0448\u0435\u043D\u043D\u044F \u043D\u0435\u0434\u0456\u0439\u0441\u043D\u0435, \u043F\u0440\u043E\u0441\u0442\u0440\u043E\u0447\u0435\u043D\u0435 \u0430\u0431\u043E \u0432\u0436\u0435 \u0432\u0438\u043A\u043E\u0440\u0438\u0441\u0442\u0430\u043D\u0435",
      inviteCreateFailed: "\u041D\u0435 \u0432\u0434\u0430\u043B\u043E\u0441\u044F \u0441\u0442\u0432\u043E\u0440\u0438\u0442\u0438 \u0437\u0430\u043F\u0440\u043E\u0448\u0435\u043D\u043D\u044F",
      ownInvite: "\u0426\u0435 \u0432\u0430\u0448\u0435 \u0432\u043B\u0430\u0441\u043D\u0435 \u043F\u043E\u0441\u0438\u043B\u0430\u043D\u043D\u044F-\u0437\u0430\u043F\u0440\u043E\u0448\u0435\u043D\u043D\u044F",
      groupNameRequired: "\u0412\u0432\u0435\u0434\u0456\u0442\u044C \u043D\u0430\u0437\u0432\u0443 \u0433\u0440\u0443\u043F\u0438",
      verificationCode: "\u041A\u043E\u0434 \u0437 \u043B\u0438\u0441\u0442\u0430",
      verifyAndRegister: "\u041F\u0456\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u0438 \u0442\u0430 \u0437\u0430\u0440\u0435\u0454\u0441\u0442\u0440\u0443\u0432\u0430\u0442\u0438\u0441\u044F",
      verificationSent: "\u041A\u043E\u0434 \u043D\u0430\u0434\u0456\u0441\u043B\u0430\u043D\u043E \u043D\u0430 \u043F\u043E\u0448\u0442\u0443. \u0412\u0456\u043D \u0434\u0456\u0454 10 \u0445\u0432\u0438\u043B\u0438\u043D.",
      verificationInvalid: "\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0438\u0439 \u0430\u0431\u043E \u043F\u0440\u043E\u0441\u0442\u0440\u043E\u0447\u0435\u043D\u0438\u0439 \u043A\u043E\u0434",
      mailUnavailable: "\u041D\u0430\u0434\u0441\u0438\u043B\u0430\u043D\u043D\u044F \u043B\u0438\u0441\u0442\u0456\u0432 \u043D\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0456 \u0449\u0435 \u043D\u0435 \u043D\u0430\u043B\u0430\u0448\u0442\u043E\u0432\u0430\u043D\u043E",
      speaker: "\u0414\u0438\u043D\u0430\u043C\u0456\u043A",
      earpiece: "\u0420\u043E\u0437\u043C\u043E\u0432\u043D\u0438\u0439 \u0434\u0438\u043D\u0430\u043C\u0456\u043A",
      microphone: "\u041C\u0456\u043A\u0440\u043E\u0444\u043E\u043D",
      camera: "\u041A\u0430\u043C\u0435\u0440\u0430",
      shareScreen: "\u0414\u0435\u043C\u043E\u043D\u0441\u0442\u0440\u0430\u0446\u0456\u044F \u0435\u043A\u0440\u0430\u043D\u0430",
      incomingCall: "\u0412\u0445\u0456\u0434\u043D\u0438\u0439 \u0434\u0437\u0432\u0456\u043D\u043E\u043A",
      audioCall: "\u0410\u0443\u0434\u0456\u043E\u0434\u0437\u0432\u0456\u043D\u043E\u043A",
      videoCall: "\u0412\u0456\u0434\u0435\u043E\u0434\u0437\u0432\u0456\u043D\u043E\u043A",
      calling: "\u0432\u0438\u043A\u043B\u0438\u043A\u2026",
      connecting: "\u0437'\u0454\u0434\u043D\u0430\u043D\u043D\u044F\u2026",
      inCall: "\u0443 \u0434\u0437\u0432\u0456\u043D\u043A\u0443",
      callEnded: "\u0414\u0437\u0432\u0456\u043D\u043E\u043A \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043E",
      callDeclined: "\u0414\u0437\u0432\u0456\u043D\u043E\u043A \u0432\u0456\u0434\u0445\u0438\u043B\u0435\u043D\u043E",
      peerDisconnected: "\u0421\u043F\u0456\u0432\u0440\u043E\u0437\u043C\u043E\u0432\u043D\u0438\u043A \u0432\u0456\u0434\u043A\u043B\u044E\u0447\u0438\u0432\u0441\u044F",
      noCamera: "\u041A\u0430\u043C\u0435\u0440\u0430 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0430 \u2014 \u043F\u0440\u043E\u0434\u043E\u0432\u0436\u0443\u0454\u043C\u043E \u043B\u0438\u0448\u0435 \u0437 \u043C\u0456\u043A\u0440\u043E\u0444\u043E\u043D\u043E\u043C",
      allowMicrophone: "\u0414\u043E\u0437\u0432\u043E\u043B\u044C\u0442\u0435 \u0434\u043E\u0441\u0442\u0443\u043F \u0434\u043E \u043C\u0456\u043A\u0440\u043E\u0444\u043E\u043D\u0430",
      shareUnsupported: "\u0414\u0435\u043C\u043E\u043D\u0441\u0442\u0440\u0430\u0446\u0456\u044F \u0435\u043A\u0440\u0430\u043D\u0430 \u043D\u0435 \u043F\u0456\u0434\u0442\u0440\u0438\u043C\u0443\u0454\u0442\u044C\u0441\u044F \u043D\u0430 \u0446\u044C\u043E\u043C\u0443 \u043F\u0440\u0438\u0441\u0442\u0440\u043E\u0457",
      outputUnsupported: "\u041F\u0435\u0440\u0435\u043C\u0438\u043A\u0430\u043D\u043D\u044F \u0430\u0443\u0434\u0456\u043E\u0432\u0438\u0445\u043E\u0434\u0443 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0435 \u0432 \u0446\u044C\u043E\u043C\u0443 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0456",
      emailExists: "\u0426\u0435\u0439 email \u0443\u0436\u0435 \u0437\u0430\u0440\u0435\u0454\u0441\u0442\u0440\u043E\u0432\u0430\u043D\u043E",
      invalidCredentials: "\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0438\u0439 email \u0430\u0431\u043E \u043F\u0430\u0440\u043E\u043B\u044C",
      invalidRegistration: "\u041F\u0435\u0440\u0435\u0432\u0456\u0440\u0442\u0435 \u0456\u043C'\u044F, email \u0456 \u043F\u0430\u0440\u043E\u043B\u044C (\u0449\u043E\u043D\u0430\u0439\u043C\u0435\u043D\u0448\u0435 8 \u0441\u0438\u043C\u0432\u043E\u043B\u0456\u0432)",
      serverError: "\u0421\u0435\u0440\u0432\u0435\u0440 \u0442\u0438\u043C\u0447\u0430\u0441\u043E\u0432\u043E \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0438\u0439",
      chatCreateFailed: "\u041D\u0435 \u0432\u0434\u0430\u043B\u043E\u0441\u044F \u0441\u0442\u0432\u043E\u0440\u0438\u0442\u0438 \u0447\u0430\u0442",
      encrypted: "\u0417\u0430\u0448\u0438\u0444\u0440\u043E\u0432\u0430\u043D\u043E",
      photo: "\u0424\u043E\u0442\u043E",
      file: "\u0424\u0430\u0439\u043B",
      download: "\u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0438\u0442\u0438",
      imageTooLarge: "\u0424\u0430\u0439\u043B \u0437\u0430\u0432\u0435\u043B\u0438\u043A\u0438\u0439",
      logout: "\u0412\u0438\u0439\u0442\u0438",
      noChats: "\u0427\u0430\u0442\u0456\u0432 \u043F\u043E\u043A\u0438 \u043D\u0435\u043C\u0430\u0454",
      noChatsHint: "\u041D\u0430\u0442\u0438\u0441\u043D\u0456\u0442\u044C \u270E, \u0449\u043E\u0431 \u043F\u043E\u0447\u0430\u0442\u0438 \u0434\u0456\u0430\u043B\u043E\u0433",
      group: "\u0413\u0440\u0443\u043F\u0430",
      members: "\u0443\u0447\u0430\u0441\u043D\u0438\u043A\u0456\u0432",
      you: "\u0412\u0438",
      today: "\u0421\u044C\u043E\u0433\u043E\u0434\u043D\u0456",
      yesterday: "\u0412\u0447\u043E\u0440\u0430",
      install: "\u0412\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u0438 M0D",
      cryptoError: "\u041D\u0435 \u0432\u0434\u0430\u043B\u043E\u0441\u044F \u0432\u0456\u0434\u043A\u0440\u0438\u0442\u0438 \u043A\u043B\u044E\u0447\u0456 \u0448\u0438\u0444\u0440\u0443\u0432\u0430\u043D\u043D\u044F \u0446\u044C\u043E\u0433\u043E \u0430\u043A\u0430\u0443\u043D\u0442\u0430 \u043D\u0430 \u043F\u0440\u0438\u0441\u0442\u0440\u043E\u0457",
      sessionExpired: "\u0421\u0435\u0441\u0456\u044E \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043E. \u0423\u0432\u0456\u0439\u0434\u0456\u0442\u044C \u0437\u043D\u043E\u0432\u0443."
    }
  };
  var current = localStorage.getItem("m0d_lang") || (navigator.language || "en").slice(0, 2);
  if (!dictionaries[current]) current = "en";
  function getLanguage() {
    return current;
  }
  function t(key) {
    var _a11;
    return ((_a11 = dictionaries[current]) == null ? void 0 : _a11[key]) || dictionaries.en[key] || key;
  }
  function setLanguage(language) {
    current = dictionaries[language] ? language : "en";
    localStorage.setItem("m0d_lang", current);
    document.documentElement.lang = current;
    applyTranslations();
  }
  function applyTranslations(root = document) {
    document.documentElement.lang = current;
    root.querySelectorAll("[data-i18n]").forEach((node) => {
      const value = t(node.dataset.i18n);
      if (value) node.textContent = value;
    });
    root.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
      const value = t(node.dataset.i18nPlaceholder);
      if (value) node.setAttribute("placeholder", value);
    });
    root.querySelectorAll("[data-i18n-title]").forEach((node) => {
      const value = t(node.dataset.i18nTitle);
      if (value) node.setAttribute("title", value);
    });
  }

  // apps/web/crypto.js
  var enc = new TextEncoder();
  var dec = new TextDecoder();
  function bytesToBase64(bytes) {
    const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
    let binary = "";
    for (let i = 0; i < view.length; i += 32768) {
      binary += String.fromCharCode(...view.subarray(i, i + 32768));
    }
    return btoa(binary);
  }
  function base64ToBytes(value) {
    const binary = atob(value);
    const out = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
    return out;
  }
  function randomBytes(size) {
    const out = new Uint8Array(size);
    crypto.getRandomValues(out);
    return out;
  }
  function passwordKey(password, salt, iterations = 25e4) {
    return __async(this, null, function* () {
      const base = yield crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        "PBKDF2",
        false,
        ["deriveKey"]
      );
      return crypto.subtle.deriveKey(
        { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
        base,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
      );
    });
  }
  function deriveAuthSecret(email, password) {
    return __async(this, null, function* () {
      const normalizedEmail = String(email || "").trim().toLowerCase();
      const base = yield crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        "PBKDF2",
        false,
        ["deriveBits"]
      );
      const salt = yield crypto.subtle.digest(
        "SHA-256",
        enc.encode("M0D-auth-v1:".concat(normalizedEmail))
      );
      const bits = yield crypto.subtle.deriveBits(
        {
          name: "PBKDF2",
          salt: new Uint8Array(salt),
          iterations: 25e4,
          hash: "SHA-256"
        },
        base,
        256
      );
      return bytesToBase64(bits);
    });
  }
  function createIdentity(password) {
    return __async(this, null, function* () {
      const pair = yield crypto.subtle.generateKey(
        { name: "ECDH", namedCurve: "P-256" },
        true,
        ["deriveBits"]
      );
      const publicKeyJwk = yield crypto.subtle.exportKey("jwk", pair.publicKey);
      const privateKeyJwk = yield crypto.subtle.exportKey("jwk", pair.privateKey);
      const encryptedPrivateKey = yield protectPrivateKey(privateKeyJwk, password);
      return { pair, publicKeyJwk, encryptedPrivateKey };
    });
  }
  function protectPrivateKey(privateKeyJwk, password) {
    return __async(this, null, function* () {
      const salt = randomBytes(16);
      const iv = randomBytes(12);
      const key = yield passwordKey(password, salt);
      const plaintext = enc.encode(JSON.stringify(privateKeyJwk));
      const ciphertext = yield crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plaintext);
      return {
        version: 1,
        kdf: "PBKDF2-SHA256",
        iterations: 25e4,
        salt: bytesToBase64(salt),
        iv: bytesToBase64(iv),
        ciphertext: bytesToBase64(ciphertext)
      };
    });
  }
  function unlockPrivateKey(encryptedPrivateKey, password) {
    return __async(this, null, function* () {
      const salt = base64ToBytes(encryptedPrivateKey.salt);
      const iv = base64ToBytes(encryptedPrivateKey.iv);
      const key = yield passwordKey(password, salt, Number(encryptedPrivateKey.iterations || 25e4));
      const plaintext = yield crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        base64ToBytes(encryptedPrivateKey.ciphertext)
      );
      const jwk = JSON.parse(dec.decode(plaintext));
      return crypto.subtle.importKey(
        "jwk",
        jwk,
        { name: "ECDH", namedCurve: "P-256" },
        true,
        ["deriveBits"]
      );
    });
  }
  function importPublicKey(jwk) {
    return __async(this, null, function* () {
      return crypto.subtle.importKey(
        "jwk",
        jwk,
        { name: "ECDH", namedCurve: "P-256" },
        false,
        []
      );
    });
  }
  function deriveWrapKey(privateKey, publicKeyJwk, context) {
    return __async(this, null, function* () {
      const publicKey = yield importPublicKey(publicKeyJwk);
      const shared = yield crypto.subtle.deriveBits(
        { name: "ECDH", public: publicKey },
        privateKey,
        256
      );
      const hkdfBase = yield crypto.subtle.importKey("raw", shared, "HKDF", false, ["deriveKey"]);
      return crypto.subtle.deriveKey(
        {
          name: "HKDF",
          hash: "SHA-256",
          salt: enc.encode("M0D-room-key"),
          info: enc.encode(String(context))
        },
        hkdfBase,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
      );
    });
  }
  function generateRoomKey() {
    return __async(this, null, function* () {
      return crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
    });
  }
  function exportRoomKey(roomKey) {
    return __async(this, null, function* () {
      const raw = yield crypto.subtle.exportKey("raw", roomKey);
      return bytesToBase64(raw);
    });
  }
  function importRoomKey(value) {
    return __async(this, null, function* () {
      return crypto.subtle.importKey(
        "raw",
        base64ToBytes(value),
        { name: "AES-GCM" },
        true,
        ["encrypt", "decrypt"]
      );
    });
  }
  function wrapRoomKey(roomKey, privateKey, recipientPublicKeyJwk, context) {
    return __async(this, null, function* () {
      const wrapKey = yield deriveWrapKey(privateKey, recipientPublicKeyJwk, context);
      const raw = yield crypto.subtle.exportKey("raw", roomKey);
      const iv = randomBytes(12);
      const ciphertext = yield crypto.subtle.encrypt({ name: "AES-GCM", iv }, wrapKey, raw);
      return { iv: bytesToBase64(iv), ciphertext: bytesToBase64(ciphertext) };
    });
  }
  function unwrapRoomKey(envelope, privateKey, wrapperPublicKeyJwk, context) {
    return __async(this, null, function* () {
      const wrapKey = yield deriveWrapKey(privateKey, wrapperPublicKeyJwk, context);
      const raw = yield crypto.subtle.decrypt(
        { name: "AES-GCM", iv: base64ToBytes(envelope.iv) },
        wrapKey,
        base64ToBytes(envelope.ciphertext)
      );
      return crypto.subtle.importKey(
        "raw",
        raw,
        { name: "AES-GCM" },
        true,
        ["encrypt", "decrypt"]
      );
    });
  }
  function encryptJson(roomKey, value) {
    return __async(this, null, function* () {
      const iv = randomBytes(12);
      const plaintext = enc.encode(JSON.stringify(value));
      const ciphertext = yield crypto.subtle.encrypt({ name: "AES-GCM", iv }, roomKey, plaintext);
      return { iv: bytesToBase64(iv), ciphertext: bytesToBase64(ciphertext) };
    });
  }
  function decryptJson(roomKey, envelope) {
    return __async(this, null, function* () {
      const plaintext = yield crypto.subtle.decrypt(
        { name: "AES-GCM", iv: base64ToBytes(envelope.iv) },
        roomKey,
        base64ToBytes(envelope.ciphertext)
      );
      return JSON.parse(dec.decode(plaintext));
    });
  }
  function encryptBytes(roomKey, bytes) {
    return __async(this, null, function* () {
      const iv = randomBytes(12);
      const ciphertext = yield crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        roomKey,
        bytes
      );
      return { iv: bytesToBase64(iv), ciphertext };
    });
  }
  function decryptBytes(roomKey, envelope) {
    return __async(this, null, function* () {
      return crypto.subtle.decrypt(
        { name: "AES-GCM", iv: base64ToBytes(envelope.iv) },
        roomKey,
        envelope.ciphertext
      );
    });
  }

  // apps/web/app.js
  var $ = (id) => document.getElementById(id);
  var ui = {
    authView: $("authView"),
    appView: $("appView"),
    loginTab: $("loginTab"),
    registerTab: $("registerTab"),
    authForm: $("authForm"),
    nameLabel: $("nameLabel"),
    nameInput: $("nameInput"),
    emailInput: $("emailInput"),
    passwordInput: $("passwordInput"),
    verificationLabel: $("verificationLabel"),
    verificationCodeInput: $("verificationCodeInput"),
    authSubmit: $("authSubmit"),
    authError: $("authError"),
    sidebar: $("sidebar"),
    menuButton: $("menuButton"),
    newChatButton: $("newChatButton"),
    mobileSearchButton: $("mobileSearchButton"),
    mobileChatFilters: $("mobileChatFilters"),
    mobileBottomNav: $("mobileBottomNav"),
    mobileProfileTab: $("mobileProfileTab"),
    mobileCallsTab: $("mobileCallsTab"),
    mobileChatsTab: $("mobileChatsTab"),
    mobileSettingsTab: $("mobileSettingsTab"),
    mobileCallsView: $("mobileCallsView"),
    mobileCallsList: $("mobileCallsList"),
    closeMobileCallsButton: $("closeMobileCallsButton"),
    chatSearch: $("chatSearch"),
    chatList: $("chatList"),
    meAvatar: $("meAvatar"),
    meName: $("meName"),
    meEmail: $("meEmail"),
    logoutButton: $("logoutButton"),
    chatPane: $("chatPane"),
    emptyChat: $("emptyChat"),
    activeChat: $("activeChat"),
    backButton: $("backButton"),
    chatAvatar: $("chatAvatar"),
    chatTitle: $("chatTitle"),
    chatStatus: $("chatStatus"),
    audioCallButton: $("audioCallButton"),
    videoCallButton: $("videoCallButton"),
    chatInfoButton: $("chatInfoButton"),
    messageList: $("messageList"),
    fileInput: $("fileInput"),
    attachButton: $("attachButton"),
    composerContext: $("composerContext"),
    composerContextTitle: $("composerContextTitle"),
    composerContextText: $("composerContextText"),
    cancelComposerContext: $("cancelComposerContext"),
    readOnlyHint: $("readOnlyHint"),
    messageInput: $("messageInput"),
    sendButton: $("sendButton"),
    drawerBackdrop: $("drawerBackdrop"),
    settingsDrawer: $("settingsDrawer"),
    closeDrawerButton: $("closeDrawerButton"),
    enableNotificationsButton: $("enableNotificationsButton"),
    newChatModal: $("newChatModal"),
    closeNewChatButton: $("closeNewChatButton"),
    inviteKindInput: $("inviteKindInput"),
    groupTitleLabel: $("groupTitleLabel"),
    groupTitleInput: $("groupTitleInput"),
    descriptionLabel: $("descriptionLabel"),
    descriptionInput: $("descriptionInput"),
    newChatHelp: $("newChatHelp"),
    inviteResult: $("inviteResult"),
    inviteLinkInput: $("inviteLinkInput"),
    copyInviteButton: $("copyInviteButton"),
    newChatError: $("newChatError"),
    createChatButton: $("createChatButton"),
    chatInfoModal: $("chatInfoModal"),
    closeChatInfoButton: $("closeChatInfoButton"),
    infoTitle: $("infoTitle"),
    infoSubtitle: $("infoSubtitle"),
    infoDescription: $("infoDescription"),
    shareInviteButton: $("shareInviteButton"),
    editConversationButton: $("editConversationButton"),
    muteConversationButton: $("muteConversationButton"),
    toggleCommentsButton: $("toggleCommentsButton"),
    infoInviteResult: $("infoInviteResult"),
    infoInviteLink: $("infoInviteLink"),
    copyInfoInviteButton: $("copyInfoInviteButton"),
    memberCount: $("memberCount"),
    memberList: $("memberList"),
    leaveConversationButton: $("leaveConversationButton"),
    threadModal: $("threadModal"),
    closeThreadButton: $("closeThreadButton"),
    threadSubtitle: $("threadSubtitle"),
    threadMessageList: $("threadMessageList"),
    threadInput: $("threadInput"),
    threadSendButton: $("threadSendButton"),
    callOverlay: $("callOverlay"),
    callMiniBar: $("callMiniBar"),
    restoreCallButton: $("restoreCallButton"),
    callMiniName: $("callMiniName"),
    callMiniStatus: $("callMiniStatus"),
    miniMicButton: $("miniMicButton"),
    miniEndCallButton: $("miniEndCallButton"),
    remoteVideo: $("remoteVideo"),
    callBackdropAvatar: $("callBackdropAvatar"),
    minimizeCallButton: $("minimizeCallButton"),
    callPeerName: $("callPeerName"),
    callStatus: $("callStatus"),
    callRoute: $("callRoute"),
    localVideoFrame: $("localVideoFrame"),
    localVideo: $("localVideo"),
    incomingActions: $("incomingActions"),
    declineCallButton: $("declineCallButton"),
    acceptCallButton: $("acceptCallButton"),
    activeCallControls: $("activeCallControls"),
    speakerButton: $("speakerButton"),
    micButton: $("micButton"),
    cameraButton: $("cameraButton"),
    screenButton: $("screenButton"),
    endCallButton: $("endCallButton"),
    toast: $("toast")
  };
  var state = {
    authMode: "login",
    verificationId: null,
    pendingInvite: null,
    pendingNativeConversation: null,
    me: null,
    privateKey: null,
    conversations: [],
    roomKeys: /* @__PURE__ */ new Map(),
    activeConversation: null,
    online: /* @__PURE__ */ new Set(),
    ws: null,
    toastTimer: null,
    replyTo: null,
    editingMessage: null,
    messageCache: /* @__PURE__ */ new Map(),
    threadRoot: null,
    typingTimer: null,
    remoteTypingTimer: null,
    messageView: { epoch: 0, request: 0, writes: /* @__PURE__ */ new Map() },
    threadView: { epoch: 0, request: 0, writes: /* @__PURE__ */ new Map() },
    conversationRequest: 0,
    conversationLoad: null,
    routeRequest: 0,
    userSearchRequest: 0,
    mobileChatFilter: "all",
    readRequests: /* @__PURE__ */ new Map(),
    sendingText: false,
    sendingThread: false,
    pendingSends: /* @__PURE__ */ new Map(),
    drafts: /* @__PURE__ */ new Map(),
    reconnectTimer: null,
    seenMessages: /* @__PURE__ */ new Set(),
    call: {
      state: "idle",
      peerId: null,
      conversationId: null,
      video: false,
      videoWanted: false,
      pc: null,
      localStream: null,
      screenStream: null,
      pendingIce: [],
      startedAt: 0,
      timer: null,
      stats: null,
      speaker: true,
      offerer: false,
      recoveryTimer: null,
      failureTimer: null,
      recoveryAttempts: 0,
      mediaRepairing: false,
      resumeRepairTimer: null
    }
  };
  function firstLetter(value) {
    return String(value || "?").trim().charAt(0).toUpperCase() || "?";
  }
  function showToast(message, timeout = 2800) {
    clearTimeout(state.toastTimer);
    ui.toast.textContent = message;
    ui.toast.classList.remove("hidden");
    state.toastTimer = setTimeout(() => ui.toast.classList.add("hidden"), timeout);
  }
  function api(_0) {
    return __async(this, arguments, function* (url, options = {}) {
      const headers = __spreadValues({}, options.headers || {});
      if (options.body && !(options.body instanceof Blob) && !(options.body instanceof ArrayBuffer)) {
        headers["Content-Type"] || (headers["Content-Type"] = "application/json");
      }
      const response = yield fetch(url, __spreadProps(__spreadValues({}, options), { headers }));
      const type = response.headers.get("content-type") || "";
      const data = type.includes("application/json") ? yield response.json().catch(() => ({})) : yield response.arrayBuffer();
      if (!response.ok) {
        const error = new Error((data == null ? void 0 : data.error) || "request_failed");
        error.status = response.status;
        error.code = data == null ? void 0 : data.error;
        throw error;
      }
      return data;
    });
  }
  function dbOpen() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("m0d", 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains("identity")) db.createObjectStore("identity");
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  function identityGet(userId) {
    return __async(this, null, function* () {
      const db = yield dbOpen();
      return new Promise((resolve, reject) => {
        const tx = db.transaction("identity", "readonly");
        const request = tx.objectStore("identity").get(userId);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
      });
    });
  }
  function identitySet(userId, privateKey) {
    return __async(this, null, function* () {
      const db = yield dbOpen();
      return new Promise((resolve, reject) => {
        const tx = db.transaction("identity", "readwrite");
        tx.objectStore("identity").put(privateKey, userId);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    });
  }
  function identityDelete(userId) {
    return __async(this, null, function* () {
      if (!userId) return;
      const db = yield dbOpen();
      return new Promise((resolve) => {
        const tx = db.transaction("identity", "readwrite");
        tx.objectStore("identity").delete(userId);
        tx.oncomplete = resolve;
        tx.onerror = resolve;
      });
    });
  }
  function setAuthMode(mode) {
    state.authMode = mode;
    const register = mode === "register";
    ui.loginTab.classList.toggle("active", !register);
    ui.registerTab.classList.toggle("active", register);
    ui.nameLabel.classList.toggle("hidden", !register);
    state.verificationId = null;
    ui.verificationLabel.classList.add("hidden");
    ui.verificationCodeInput.value = "";
    ui.authSubmit.dataset.i18n = register ? "register" : "login";
    ui.passwordInput.autocomplete = register ? "new-password" : "current-password";
    applyTranslations();
    ui.authError.textContent = "";
  }
  function mapAuthError(error) {
    if (error.code === "email_exists") return t("emailExists");
    if (error.code === "invalid_credentials") return t("invalidCredentials");
    if (error.code === "invalid_registration" || error.code === "invalid_email") return t("invalidRegistration");
    if (error.code === "verification_invalid") return t("verificationInvalid");
    if (error.code === "mail_not_configured") return t("mailUnavailable");
    return t("serverError");
  }
  function submitAuth(event) {
    return __async(this, null, function* () {
      event.preventDefault();
      ui.authError.textContent = "";
      ui.authSubmit.disabled = true;
      const email = ui.emailInput.value.trim().toLowerCase();
      const password = ui.passwordInput.value;
      try {
        if (state.authMode === "register" && !state.verificationId) {
          const started = yield api("/api/auth/register/start", {
            method: "POST",
            body: JSON.stringify({ email, language: getLanguage() })
          });
          state.verificationId = started.verificationId;
          ui.verificationLabel.classList.remove("hidden");
          ui.authSubmit.dataset.i18n = "verifyAndRegister";
          applyTranslations();
          ui.authError.textContent = t("verificationSent");
          ui.verificationCodeInput.focus();
          return;
        }
        const authSecret = yield deriveAuthSecret(email, password);
        if (state.authMode === "register") {
          const displayName = ui.nameInput.value.trim();
          const identity = yield createIdentity(password);
          const result = yield api("/api/auth/register", {
            method: "POST",
            body: JSON.stringify({
              email,
              authSecret,
              displayName,
              verificationId: state.verificationId,
              code: ui.verificationCodeInput.value.trim(),
              publicKeyJwk: identity.publicKeyJwk,
              encryptedPrivateKey: identity.encryptedPrivateKey
            })
          });
          state.me = result.user;
          state.privateKey = identity.pair.privateKey;
          yield identitySet(state.me.id, state.privateKey);
        } else {
          let result;
          try {
            result = yield api("/api/auth/login", {
              method: "POST",
              body: JSON.stringify({ email, authSecret })
            });
          } catch (error) {
            if (error.code !== "legacy_auth_required") throw error;
            result = yield api("/api/auth/login", {
              method: "POST",
              body: JSON.stringify({ email, authSecret, password })
            });
          }
          state.me = result.user;
          state.privateKey = yield unlockPrivateKey(state.me.encrypted_private_key, password);
          yield identitySet(state.me.id, state.privateKey);
        }
        ui.passwordInput.value = "";
        yield enterMessenger();
      } catch (error) {
        ui.authError.textContent = mapAuthError(error);
      } finally {
        ui.authSubmit.disabled = false;
      }
    });
  }
  function conversationName(conversation) {
    if (conversation.kind === "group") return conversation.title || t("group");
    if (conversation.kind === "channel") return conversation.title || t("channel");
    const other = conversation.members.find((member) => member.id !== state.me.id);
    return (other == null ? void 0 : other.displayName) || (other == null ? void 0 : other.display_name) || "M0D";
  }
  function myRole(conversation) {
    var _a11, _b;
    return (conversation == null ? void 0 : conversation.my_role) || ((_b = (_a11 = conversation == null ? void 0 : conversation.members) == null ? void 0 : _a11.find((member) => {
      var _a12;
      return member.id === ((_a12 = state.me) == null ? void 0 : _a12.id);
    })) == null ? void 0 : _b.role) || "member";
  }
  function canManageConversation(conversation) {
    return ["owner", "admin"].includes(myRole(conversation));
  }
  function canPostToConversation(conversation) {
    if (!conversation) return false;
    return conversation.kind !== "channel" || canManageConversation(conversation);
  }
  function directPeer(conversation) {
    if (!conversation || conversation.kind !== "direct") return null;
    return conversation.members.find((member) => member.id !== state.me.id) || null;
  }
  function conversationStatus(conversation) {
    if (conversation.kind === "group") {
      return "".concat(conversation.members.length, " ").concat(t("members"));
    }
    if (conversation.kind === "channel") {
      return "".concat(conversation.members.length, " ").concat(t("subscriber"));
    }
    const peer = directPeer(conversation);
    return peer && state.online.has(peer.id) ? t("online") : t("offline");
  }
  function parseStoredKeyEnvelope(conversation) {
    let stored;
    try {
      stored = JSON.parse(conversation.key_ciphertext);
    } catch (e) {
      return { context: conversation.id, ciphertext: conversation.key_ciphertext };
    }
    if (!(stored == null ? void 0 : stored.context) || !(stored == null ? void 0 : stored.data)) {
      return { context: conversation.id, ciphertext: conversation.key_ciphertext };
    }
    return { context: stored.context, ciphertext: stored.data };
  }
  function unlockConversationKey(conversation) {
    return __async(this, null, function* () {
      if (state.roomKeys.has(conversation.id)) return state.roomKeys.get(conversation.id);
      const wrapper = conversation.members.find((member) => member.id === conversation.wrapped_by_user_id);
      if (!wrapper) throw new Error("wrapper_missing");
      const stored = parseStoredKeyEnvelope(conversation);
      const roomKey = yield unwrapRoomKey(
        { iv: conversation.key_iv, ciphertext: stored.ciphertext },
        state.privateKey,
        wrapper.publicKeyJwk,
        stored.context
      );
      state.roomKeys.set(conversation.id, roomKey);
      return roomKey;
    });
  }
  function shortTime(value) {
    if (!value) return "";
    return new Intl.DateTimeFormat(getLanguage(), {
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(value));
  }
  function readableSize(bytes) {
    const value = Number(bytes || 0);
    if (value < 1024) return "".concat(value, " B");
    if (value < 1024 * 1024) return "".concat((value / 1024).toFixed(1), " KB");
    return "".concat((value / 1024 / 1024).toFixed(1), " MB");
  }
  function previewFor(conversation) {
    return __async(this, null, function* () {
      var _a11;
      if (conversation.last_system_event) return callText(conversation.last_system_event);
      if (!conversation.last_ciphertext) return t("encrypted");
      try {
        const roomKey = yield unlockConversationKey(conversation);
        const body = yield decryptJson(roomKey, {
          iv: conversation.last_iv,
          ciphertext: conversation.last_ciphertext
        });
        if (((_a11 = body.attachment) == null ? void 0 : _a11.kind) === "image" && !body.text) return t("photo");
        if (body.attachment && !body.text) return body.attachment.name || t("file");
        return body.text || t("encrypted");
      } catch (e) {
        return "\u{1F512} " + t("encrypted");
      }
    });
  }
  function renderConversationList() {
    return __async(this, null, function* () {
      var _a11, _b;
      const query = ui.chatSearch.value.trim().toLowerCase();
      const request = ++state.userSearchRequest;
      const list = state.conversations.filter((c) => {
        const matchesQuery = (conversationName(c) + " " + c.members.map((m) => m.username ? "@" + m.username : "").join(" ")).toLowerCase().includes(query);
        const filter = ["all", "direct", "group", "channel"].includes(state.mobileChatFilter) ? state.mobileChatFilter : "all";
        const matchesFilter = filter === "all" || c.kind === filter;
        return matchesQuery && matchesFilter;
      });
      const scrollTop = ui.chatList.scrollTop;
      ui.chatList.replaceChildren();
      for (const conversation of list) {
        const row = document.createElement("button");
        row.className = "chat-row" + (((_a11 = state.activeConversation) == null ? void 0 : _a11.id) === conversation.id ? " active" : "");
        row.type = "button";
        row.dataset.conversationId = conversation.id;
        row.setAttribute("aria-current", String(((_b = state.activeConversation) == null ? void 0 : _b.id) === conversation.id));
        const avatar = document.createElement("div");
        avatar.className = "avatar";
        paintAvatar(avatar, directPeer(conversation), conversationName(conversation));
        const main = document.createElement("div");
        main.className = "chat-row-main";
        main.innerHTML = '\n      <div class="chat-row-top">\n        <span class="chat-row-name"></span>\n        <span class="chat-time">'.concat(shortTime(conversation.last_message_at || conversation.created_at), '</span>\n      </div>\n      <div class="chat-row-bottom">\n        <div class="chat-preview">\u{1F512} ').concat(t("encrypted"), '</div>\n        <span class="unread-badge ').concat(Number(conversation.unread_count || 0) > 0 ? "" : "hidden", '">').concat(Number(conversation.unread_count || 0), "</span>\n      </div>\n    ");
        main.querySelector(".chat-row-name").textContent = conversationName(conversation);
        if (conversation.notifications_enabled === false) {
          const mute = document.createElement("span");
          mute.className = "chat-muted";
          mute.textContent = "\u25CC";
          mute.title = t("mute");
          main.querySelector(".chat-row-top").append(mute);
        }
        if (conversation.pinned_count > 0) {
          const pin = document.createElement("span");
          pin.className = "chat-pinned";
          pin.textContent = "\u2316";
          pin.title = t("pinnedMessages");
          main.querySelector(".chat-row-bottom").append(pin);
        }
        row.append(avatar, main);
        row.addEventListener("click", () => openConversation(conversation.id));
        ui.chatList.appendChild(row);
        previewFor(conversation).then((text) => {
          const preview = main.querySelector(".chat-preview");
          if (preview) preview.textContent = text;
        });
      }
      ui.chatList.scrollTop = scrollTop;
      let globalResult = false;
      const usernameMatch = query.match(/^@([a-z][a-z0-9_]{3,31})$/);
      const directAlreadyShown = usernameMatch && list.some(
        (c) => {
          var _a12, _b2;
          return c.kind === "direct" && ((_b2 = (_a12 = directPeer(c)) == null ? void 0 : _a12.username) == null ? void 0 : _b2.toLowerCase()) === usernameMatch[1];
        }
      );
      if (usernameMatch && !directAlreadyShown) {
        try {
          const info = yield api("/api/users/by-username/".concat(encodeURIComponent(usernameMatch[1])));
          if (request !== state.userSearchRequest || ui.chatSearch.value.trim().toLowerCase() !== query) return;
          const user = info.user;
          const row = document.createElement("button");
          row.className = "chat-row global-user-result";
          row.type = "button";
          const avatar = document.createElement("div");
          avatar.className = "avatar";
          paintAvatar(avatar, user, user.display_name);
          const main = document.createElement("div");
          main.className = "chat-row-main";
          const top = document.createElement("div");
          top.className = "chat-row-top";
          const name = document.createElement("span");
          name.className = "chat-row-name";
          name.textContent = user.id === state.me.id ? "".concat(user.display_name, " \xB7 ").concat(t("you")) : user.display_name;
          const preview = document.createElement("div");
          preview.className = "chat-preview";
          preview.textContent = "@" + user.username;
          top.append(name);
          main.append(top, preview);
          row.append(avatar, main);
          row.addEventListener("click", () => {
            location.hash = "@" + user.username;
          });
          ui.chatList.appendChild(row);
          globalResult = true;
        } catch (error) {
          if (request !== state.userSearchRequest) return;
          if ((error == null ? void 0 : error.status) !== 404 && (error == null ? void 0 : error.status) !== 400) throw error;
        }
      }
      if (!list.length && !globalResult && request === state.userSearchRequest) {
        const empty = document.createElement("div");
        empty.className = "empty-list";
        empty.innerHTML = "<div><strong>".concat(t("noChats"), "</strong><p>").concat(t("noChatsHint"), "</p></div>");
        ui.chatList.appendChild(empty);
      }
    });
  }
  function loadConversations() {
    const request = ++state.conversationRequest;
    const pending = refreshConversations(request);
    state.conversationLoad = pending;
    return pending;
  }
  function refreshConversations(request) {
    return __async(this, null, function* () {
      var _a11;
      const result = yield api("/api/conversations");
      if (!state.me) return;
      if (request !== state.conversationRequest) return state.conversationLoad;
      const previous = new Map(state.conversations.map((c) => [c.id, c]));
      if (!Array.isArray(result.conversations)) throw new Error("invalid_conversations_response");
      state.conversations = result.conversations;
      for (const conversation of state.conversations) {
        const old = previous.get(conversation.id);
        conversation.last_read_message_id = Math.max(Number(conversation.last_read_message_id || 0), Number((old == null ? void 0 : old.last_read_message_id) || 0));
        for (const member of conversation.members) {
          const known = (_a11 = old == null ? void 0 : old.members) == null ? void 0 : _a11.find((m) => m.id === member.id);
          member.lastReadMessageId = Math.max(Number(member.lastReadMessageId || 0), Number((known == null ? void 0 : known.lastReadMessageId) || 0));
        }
      }
      if (state.activeConversation) {
        const refreshed = state.conversations.find((c) => c.id === state.activeConversation.id);
        if (refreshed) state.activeConversation = refreshed;
      }
      yield renderConversationList();
      updateChatHeader();
      yield refreshPinnedMessage();
    });
  }
  function updateChatHeader() {
    var _a11, _b;
    const conversation = state.activeConversation;
    if (!conversation) return;
    const name = conversationName(conversation);
    paintAvatar(ui.chatAvatar, directPeer(state.activeConversation), name);
    ui.chatTitle.textContent = name;
    const peer = directPeer(conversation);
    const status = conversationStatus(conversation);
    ui.chatStatus.textContent = (peer == null ? void 0 : peer.username) ? "@".concat(peer.username, " \xB7 ").concat(status) : status;
    ui.chatStatus.classList.toggle("online", Boolean(peer && state.online.has(peer.id)));
    const canCall = conversation.kind === "direct";
    ui.audioCallButton.classList.toggle("hidden", !canCall);
    ui.videoCallButton.classList.toggle("hidden", !canCall);
    const readOnly = conversation.kind === "channel" && !canPostToConversation(conversation);
    ui.readOnlyHint.classList.toggle("hidden", !readOnly);
    ui.messageInput.classList.toggle("hidden", readOnly);
    ui.attachButton.classList.toggle("hidden", readOnly);
    ui.sendButton.classList.toggle("hidden", readOnly);
    (_a11 = $("emojiButton")) == null ? void 0 : _a11.classList.toggle("hidden", readOnly);
    (_b = $("voiceMessageButton")) == null ? void 0 : _b.classList.toggle("hidden", readOnly);
  }
  function clearComposerContext() {
    state.replyTo = null;
    state.editingMessage = null;
    ui.composerContext.classList.add("hidden");
    ui.composerContextTitle.textContent = "";
    ui.composerContextText.textContent = "";
  }
  function markConversationRead(messageId) {
    return __async(this, null, function* () {
      const conversation = state.activeConversation;
      const id = Number(messageId);
      if (!conversation || !Number.isSafeInteger(id) || id < 1 || document.hidden) return;
      if (ui.activeChat.classList.contains("hidden")) return;
      if (matchMedia("(max-width: 760px)").matches && !ui.appView.classList.contains("chat-open")) return;
      const pending = state.readRequests.get(conversation.id) || 0;
      if (id <= Math.max(Number(conversation.last_read_message_id || 0), pending)) return;
      state.readRequests.set(conversation.id, id);
      try {
        yield api("/api/conversations/".concat(conversation.id, "/read"), {
          method: "POST",
          body: JSON.stringify({ messageId: id })
        });
        const current2 = state.conversations.find((c) => c.id === conversation.id) || conversation;
        current2.last_read_message_id = Math.max(Number(current2.last_read_message_id || 0), id);
        if (id >= Number(current2.last_message_id || 0)) current2.unread_count = 0;
        yield renderConversationList();
      } catch (e) {
      } finally {
        if (state.readRequests.get(conversation.id) === id) state.readRequests.delete(conversation.id);
      }
    });
  }
  function resetMessageView(host, view) {
    view.epoch += 1;
    view.request += 1;
    view.writes.clear();
    host.replaceChildren();
  }
  function nearMessageBottom(host) {
    return host.scrollHeight - host.scrollTop - host.clientHeight < 90;
  }
  function markVisibleMessagesRead() {
    var _a11;
    if (nearMessageBottom(ui.messageList)) {
      const last = (_a11 = ui.messageList.lastElementChild) == null ? void 0 : _a11.dataset.messageId;
      if (last) markConversationRead(last);
    }
  }
  function updateReadReceipts() {
    var _a11;
    const conversation = state.activeConversation;
    if ((conversation == null ? void 0 : conversation.kind) !== "direct") return;
    const readThrough = Number(((_a11 = directPeer(conversation)) == null ? void 0 : _a11.lastReadMessageId) || 0);
    for (const row of ui.messageList.querySelectorAll(".message-row.out")) {
      const receipt = row.querySelector(".message-receipt");
      if (receipt) receipt.textContent = Number(row.dataset.messageId) <= readThrough ? " \u2713\u2713" : " \u2713";
    }
  }
  function openConversation(_0) {
    return __async(this, arguments, function* (id, { syncUrl = true } = {}) {
      var _a11, _b;
      const conversation = state.conversations.find((c) => c.id === id);
      if (!conversation) return;
      if (state.activeConversation) {
        state.drafts.set(state.activeConversation.id, { text: ui.messageInput.value, reply: state.replyTo, editing: state.editingMessage });
      }
      cancelVoiceRecording();
      (_a11 = $("pinnedMessageBar")) == null ? void 0 : _a11.classList.add("hidden");
      resetMessageView(ui.messageList, state.messageView);
      resetMessageView(ui.threadMessageList, state.threadView);
      state.messageCache.clear();
      ui.threadModal.classList.add("hidden");
      ui.messageInput.value = "";
      clearTimeout(state.remoteTypingTimer);
      state.activeConversation = conversation;
      closeMobileCalls();
      closeDrawer();
      setMobileNavActive(ui.mobileChatsTab);
      clearComposerContext();
      const draft = state.drafts.get(id);
      ui.messageInput.value = (draft == null ? void 0 : draft.text) || "";
      if (draft == null ? void 0 : draft.editing) beginEdit(draft.editing, { text: draft.text });
      else if (draft == null ? void 0 : draft.reply) beginReply(draft.reply, (_b = state.messageCache.get(Number(draft.reply.id))) == null ? void 0 : _b.body);
      autosizeComposer();
      state.threadRoot = null;
      ui.emptyChat.classList.add("hidden");
      ui.activeChat.classList.remove("hidden");
      ui.chatPane.classList.remove("empty");
      ui.appView.classList.add("chat-open");
      updateChatHeader();
      if (syncUrl) syncConversationUrl(conversation);
      yield renderConversationList();
      yield loadMessages();
      yield refreshPinnedMessage();
    });
  }
  function loadMessages() {
    return __async(this, null, function* () {
      const conversation = state.activeConversation;
      if (!conversation) return;
      const view = state.messageView;
      const epoch = view.epoch;
      const request = ++view.request;
      const writes = new Map(view.writes);
      const current2 = () => {
        var _a11;
        return ((_a11 = state.activeConversation) == null ? void 0 : _a11.id) === conversation.id && view.epoch === epoch && view.request === request;
      };
      const follow = nearMessageBottom(ui.messageList);
      try {
        const roomKey = yield unlockConversationKey(conversation);
        const result = yield api("/api/conversations/".concat(conversation.id, "/messages?limit=50"));
        if (!current2()) return;
        for (const message of result.messages || []) {
          const valid = () => current2() && view.writes.get(String(message.id)) === writes.get(String(message.id));
          yield appendMessage(message, roomKey, ui.messageList, false, valid);
        }
        if (!current2()) return;
        if (follow) {
          ui.messageList.scrollTop = ui.messageList.scrollHeight;
          markVisibleMessagesRead();
        }
      } catch (e) {
        if (current2()) showToast(t("serverError"));
      }
    });
  }
  function appendMessage(_0) {
    return __async(this, arguments, function* (message, roomKey = null, host = ui.messageList, isThread = false, valid = null) {
      var _a11;
      const conversation = state.conversations.find((c) => c.id === message.conversation_id);
      if (!conversation) return;
      const view = isThread ? state.threadView : state.messageView;
      const epoch = view.epoch;
      const id = String(message.id);
      const revision = valid ? null : (view.writes.get(id) || 0) + 1;
      if (!valid) view.writes.set(id, revision);
      const current2 = () => {
        var _a12, _b;
        return state.me && ((_a12 = state.activeConversation) == null ? void 0 : _a12.id) === conversation.id && view.epoch === epoch && (valid ? valid() : view.writes.get(id) === revision) && (isThread ? String((_b = state.threadRoot) == null ? void 0 : _b.id) === String(message.thread_root_id) : !message.thread_root_id);
      };
      if (!current2()) return;
      roomKey || (roomKey = yield unlockConversationKey(conversation));
      let body = { text: "" };
      if (message.system_event) {
        body = { text: callText(message.system_event) };
      } else if (!message.deleted_at) {
        try {
          body = yield decryptJson(roomKey, { iv: message.iv, ciphertext: message.ciphertext });
        } catch (e) {
          body = { text: "\u{1F512} " + t("encrypted") };
        }
      }
      if (!current2()) return;
      state.messageCache.set(Number(message.id), { message, body });
      const row = document.createElement("div");
      const mine = message.sender_id === state.me.id;
      row.className = "message-row " + (mine ? "out" : "in");
      row.dataset.messageId = message.id;
      row.dataset.createdAt = message.created_at;
      row.classList.toggle("channel-post", conversation.kind === "channel" && !isThread);
      if (message.system_event) row.classList.add("call-message");
      const bubble = document.createElement("div");
      bubble.tabIndex = 0;
      bubble.addEventListener("click", (event) => {
        if (!event.target.closest("button,a,img,video,audio") && matchMedia("(max-width:760px)").matches) row.classList.toggle("actions-open");
      });
      bubble.addEventListener("keydown", (event) => {
        if (event.key === "Escape") row.classList.remove("actions-open");
      });
      bubble.className = "message-bubble" + (message.deleted_at ? " deleted" : "");
      if ((conversation.kind === "group" || conversation.kind === "channel" || isThread) && !mine) {
        const member = conversation.members.find((m) => m.id === message.sender_id);
        const author = document.createElement("div");
        author.className = "message-author";
        author.textContent = (member == null ? void 0 : member.displayName) || message.sender_name || "M0D";
        bubble.appendChild(author);
      }
      if (message.reply_to_id) {
        const reply = document.createElement("button");
        reply.className = "reply-preview";
        reply.type = "button";
        const cached = state.messageCache.get(Number(message.reply_to_id));
        reply.textContent = ((_a11 = cached == null ? void 0 : cached.body) == null ? void 0 : _a11.text) ? "\u21A9 " + cached.body.text.slice(0, 90) : "\u21A9 #" + message.reply_to_id;
        reply.addEventListener("click", () => {
          const target = host.querySelector('[data-message-id="'.concat(message.reply_to_id, '"]'));
          target == null ? void 0 : target.scrollIntoView({ behavior: "smooth", block: "center" });
          target == null ? void 0 : target.classList.add("message-highlight");
          setTimeout(() => target == null ? void 0 : target.classList.remove("message-highlight"), 1200);
        });
        bubble.appendChild(reply);
      }
      if (message.deleted_at) {
        const deleted = document.createElement("div");
        deleted.className = "message-text deleted-text";
        deleted.textContent = t("messageDeleted");
        bubble.appendChild(deleted);
      } else {
        if (body.attachment) {
          const attachment = document.createElement("div");
          attachment.className = "message-attachment";
          bubble.appendChild(attachment);
          renderAttachment(attachment, body.attachment, roomKey).catch(() => {
            attachment.textContent = "\u{1F512} " + t("file");
          });
        }
        if (body.text) {
          const textNode = document.createElement("div");
          textNode.className = "message-text";
          textNode.textContent = body.text;
          bubble.appendChild(textNode);
        }
      }
      const reactions = Array.isArray(message.reactions) ? message.reactions : [];
      if (reactions.length) {
        const reactionRow = document.createElement("div");
        reactionRow.className = "reaction-row";
        const grouped = /* @__PURE__ */ new Map();
        for (const reaction of reactions) {
          const item = grouped.get(reaction.emoji) || { count: 0, mine: false };
          item.count += 1;
          if ((reaction.userId || reaction.user_id) === state.me.id) item.mine = true;
          grouped.set(reaction.emoji, item);
        }
        for (const [emoji, info] of grouped) {
          const chip = document.createElement("button");
          chip.type = "button";
          chip.className = "reaction-chip" + (info.mine ? " mine" : "");
          chip.textContent = "".concat(emoji, " ").concat(info.count);
          chip.addEventListener("click", () => toggleReaction(message.id, emoji));
          reactionRow.appendChild(chip);
        }
        bubble.appendChild(reactionRow);
      }
      if (!message.deleted_at && !message.system_event) {
        const actions = document.createElement("div");
        actions.className = "message-actions";
        const react = document.createElement("button");
        react.type = "button";
        react.textContent = "\u{1F44D}";
        react.title = "Reaction";
        react.addEventListener("click", () => toggleReaction(message.id, "\u{1F44D}"));
        actions.appendChild(react);
        if (!(conversation.kind === "channel" && !isThread && !message.thread_root_id)) {
          const reply = document.createElement("button");
          reply.type = "button";
          reply.textContent = "\u21A9";
          reply.title = t("reply");
          reply.addEventListener("click", () => beginReply(message, body, isThread));
          actions.appendChild(reply);
        }
        if (mine) {
          const edit = document.createElement("button");
          edit.type = "button";
          edit.textContent = "\u270E";
          edit.title = t("edit");
          edit.addEventListener("click", () => beginEdit(message, body, isThread));
          actions.appendChild(edit);
        }
        if (mine || canManageConversation(conversation)) {
          const del = document.createElement("button");
          del.type = "button";
          del.textContent = "\u232B";
          del.title = t("delete");
          del.addEventListener("click", () => deleteMessage(message.id, isThread));
          actions.appendChild(del);
        }
        if (canManageConversation(conversation) && !isThread) {
          const pin = document.createElement("button");
          pin.type = "button";
          pin.textContent = message.pinned ? "\u{1F4CC}" : "\u2316";
          pin.title = message.pinned ? t("unpin") : t("pin");
          pin.addEventListener("click", () => togglePin(message.id));
          actions.appendChild(pin);
        }
        bubble.appendChild(actions);
      }
      if (conversation.kind === "channel" && !isThread && !message.thread_root_id && !message.deleted_at) {
        const comments = document.createElement("button");
        comments.type = "button";
        comments.className = "comments-button";
        comments.textContent = "\u{1F4AC} ".concat(Number(message.comment_count || 0));
        comments.disabled = conversation.comments_enabled === false;
        comments.title = conversation.comments_enabled === false ? t("commentsDisabled") : t("comments");
        comments.addEventListener("click", () => openThread(message, body));
        bubble.appendChild(comments);
      }
      const meta = document.createElement("span");
      meta.className = "message-meta";
      let receipt = "";
      if (mine && conversation.kind === "direct" && !message.deleted_at) {
        const peer = directPeer(conversation);
        receipt = Number((peer == null ? void 0 : peer.lastReadMessageId) || 0) >= Number(message.id) ? " \u2713\u2713" : " \u2713";
      }
      meta.textContent = "".concat(message.pinned ? "\u{1F4CC} " : "").concat(message.edited_at ? t("edited") + " \xB7 " : "").concat(shortTime(message.created_at));
      if (receipt) {
        const status = document.createElement("span");
        status.className = "message-receipt";
        status.textContent = receipt;
        meta.appendChild(status);
      }
      bubble.appendChild(meta);
      row.appendChild(bubble);
      const existing = host.querySelector('[data-message-id="'.concat(message.id, '"]'));
      if (existing) existing.replaceWith(row);
      else {
        const next = Array.from(host.children).find((item) => Number(item.dataset.messageId) > Number(message.id));
        host.insertBefore(row, next || null);
      }
      updateDateLabels(host);
    });
  }
  function renderAttachment(host, attachment, roomKey) {
    return __async(this, null, function* () {
      const card = document.createElement("div");
      card.className = "file-card";
      const meta = document.createElement("div");
      meta.className = "file-meta";
      const name = document.createElement("strong");
      name.textContent = attachment.name || t("file");
      const size = document.createElement("span");
      size.textContent = readableSize(attachment.size);
      meta.append(name, size);
      const download = document.createElement("button");
      download.className = "file-download";
      download.textContent = t("download");
      card.append(meta, download);
      host.append(card);
      let objectUrl = null, loading = null;
      function load() {
        return __async(this, null, function* () {
          if (objectUrl) return objectUrl;
          if (loading) return loading;
          loading = (() => __async(null, null, function* () {
            const response = yield fetch("/api/attachments/".concat(attachment.id));
            if (!response.ok) throw new Error("attachment_download_failed");
            const plaintext = yield decryptBytes(roomKey, { iv: attachment.iv, ciphertext: yield response.arrayBuffer() });
            objectUrl = URL.createObjectURL(new Blob([plaintext], { type: attachment.mime || "application/octet-stream" }));
            host.dataset.objectUrl = objectUrl;
            return objectUrl;
          }))();
          try {
            return yield loading;
          } finally {
            loading = null;
          }
        });
      }
      download.onclick = () => __async(null, null, function* () {
        download.disabled = true;
        try {
          const a = document.createElement("a");
          a.href = yield load();
          a.download = attachment.name || "M0D-file";
          a.style.display = "none";
          document.body.append(a);
          a.click();
          a.remove();
        } catch (e) {
          showToast(t("serverError"));
        } finally {
          download.disabled = false;
        }
      });
      if (attachment.kind === "image" && /^image\/(png|jpeg|webp|gif|avif|bmp)$/i.test(attachment.mime || "")) {
        const image = document.createElement("img");
        image.className = "message-image";
        image.alt = attachment.name || t("photo");
        host.prepend(image);
        image.src = yield load();
        image.onclick = () => {
          const overlay = document.createElement("div");
          overlay.className = "media-viewer";
          const enlarged = document.createElement("img");
          enlarged.src = objectUrl;
          enlarged.alt = image.alt;
          const close = document.createElement("button");
          close.className = "round-icon";
          close.textContent = "\u2715";
          close.onclick = () => overlay.remove();
          overlay.append(enlarged, close);
          overlay.onclick = (e) => {
            if (e.target === overlay) overlay.remove();
          };
          document.body.append(overlay);
        };
      } else if (["video", "audio"].includes(attachment.kind)) {
        const play = document.createElement("button");
        play.className = "media-load";
        play.textContent = "\u25B6 " + (attachment.name || t("file"));
        host.prepend(play);
        play.onclick = () => __async(null, null, function* () {
          play.disabled = true;
          try {
            const media = document.createElement(attachment.kind);
            media.controls = true;
            media.preload = "metadata";
            media.className = "message-media";
            if (attachment.kind === "video") media.playsInline = true;
            media.src = yield load();
            play.replaceWith(media);
            media.play().catch(() => {
            });
          } catch (e) {
            play.disabled = false;
            showToast(t("serverError"));
          }
        });
      }
    });
  }
  function autosizeComposer() {
    ui.messageInput.style.height = "auto";
    ui.messageInput.style.height = Math.min(ui.messageInput.scrollHeight, 145) + "px";
  }
  function beginReply(message, body, isThread = false) {
    var _a11, _b;
    if (isThread) {
      state.threadReplyTo = message;
      state.threadEditingMessage = null;
      ui.threadSubtitle.textContent = "\u21A9 ".concat(((_a11 = body == null ? void 0 : body.text) == null ? void 0 : _a11.slice(0, 80)) || "#" + message.id);
      ui.threadInput.focus();
      return;
    }
    state.replyTo = message;
    state.editingMessage = null;
    ui.composerContextTitle.textContent = t("reply");
    ui.composerContextText.textContent = ((_b = body == null ? void 0 : body.text) == null ? void 0 : _b.slice(0, 100)) || "#" + message.id;
    ui.composerContext.classList.remove("hidden");
    ui.messageInput.focus();
  }
  function beginEdit(message, body, isThread = false) {
    var _a11;
    if (isThread) {
      state.threadEditingMessage = message;
      state.threadReplyTo = null;
      ui.threadSubtitle.textContent = t("edit");
      ui.threadInput.value = (body == null ? void 0 : body.text) || "";
      ui.threadInput.focus();
      return;
    }
    state.editingMessage = message;
    state.replyTo = null;
    ui.composerContextTitle.textContent = t("edit");
    ui.composerContextText.textContent = ((_a11 = body == null ? void 0 : body.text) == null ? void 0 : _a11.slice(0, 100)) || "#" + message.id;
    ui.composerContext.classList.remove("hidden");
    ui.messageInput.value = (body == null ? void 0 : body.text) || "";
    autosizeComposer();
    ui.messageInput.focus();
  }
  function deleteMessage(messageId, isThread = false) {
    return __async(this, null, function* () {
      const conversation = state.activeConversation;
      if (!conversation) return;
      yield api("/api/conversations/".concat(conversation.id, "/messages/").concat(messageId), { method: "DELETE" });
      if (isThread) yield loadThreadMessages();
      else yield loadMessages();
      yield loadConversations();
    });
  }
  function toggleReaction(messageId, emoji) {
    return __async(this, null, function* () {
      const conversation = state.activeConversation;
      if (!conversation) return;
      yield api("/api/conversations/".concat(conversation.id, "/messages/").concat(messageId, "/reaction"), {
        method: "POST",
        body: JSON.stringify({ emoji })
      });
      if (state.threadRoot && !ui.threadModal.classList.contains("hidden")) yield loadThreadMessages();
      else yield loadMessages();
    });
  }
  function togglePin(messageId) {
    return __async(this, null, function* () {
      const conversation = state.activeConversation;
      if (!conversation) return;
      yield api("/api/conversations/".concat(conversation.id, "/messages/").concat(messageId, "/pin"), { method: "POST", body: "{}" });
      yield loadMessages();
      yield loadConversations();
    });
  }
  function sendText() {
    return __async(this, null, function* () {
      var _a11, _b, _c, _d;
      const conversation = state.activeConversation;
      const draft = ui.messageInput.value;
      const text = draft.trim();
      if (state.sendingText || !conversation || !text || !canPostToConversation(conversation)) return;
      const editing = state.editingMessage;
      const reply = state.replyTo;
      state.sendingText = true;
      ui.sendButton.disabled = true;
      try {
        const roomKey = yield unlockConversationKey(conversation);
        if (editing) {
          const encrypted = yield encryptJson(roomKey, __spreadProps(__spreadValues({}, (_a11 = state.messageCache.get(Number(editing.id))) == null ? void 0 : _a11.body), { version: 1, text }));
          yield api("/api/conversations/".concat(conversation.id, "/messages/").concat(editing.id), {
            method: "PATCH",
            body: JSON.stringify(encrypted)
          });
          if (((_b = state.activeConversation) == null ? void 0 : _b.id) === conversation.id) yield loadMessages();
        } else {
          const result = yield postTextMessage(conversation, roomKey, text, (reply == null ? void 0 : reply.id) || null);
          yield appendMessage(result.message, roomKey);
        }
        if (((_c = state.activeConversation) == null ? void 0 : _c.id) === conversation.id && ui.messageInput.value === draft && state.editingMessage === editing && state.replyTo === reply) {
          ui.messageInput.value = "";
          autosizeComposer();
          clearComposerContext();
        }
        const savedDraft = state.drafts.get(conversation.id);
        if ((savedDraft == null ? void 0 : savedDraft.text) === draft && savedDraft.reply === reply && savedDraft.editing === editing) {
          state.drafts.delete(conversation.id);
        }
        if (((_d = state.activeConversation) == null ? void 0 : _d.id) === conversation.id) {
          ui.messageList.scrollTop = ui.messageList.scrollHeight;
          markVisibleMessagesRead();
        }
        yield loadConversations();
      } finally {
        state.sendingText = false;
        ui.sendButton.disabled = false;
      }
    });
  }
  function postTextMessage(conversation, roomKey, text, replyToId, threadRootId = null) {
    return __async(this, null, function* () {
      const key = "".concat(conversation.id, ":").concat(threadRootId || "main");
      const signature = JSON.stringify([text, replyToId]);
      let pending = state.pendingSends.get(key);
      if ((pending == null ? void 0 : pending.signature) !== signature) {
        pending = {
          signature,
          payload: __spreadProps(__spreadValues({}, yield encryptJson(roomKey, { version: 1, text })), {
            clientMessageId: crypto.randomUUID(),
            replyToId,
            threadRootId
          })
        };
        state.pendingSends.set(key, pending);
      }
      const result = yield api("/api/conversations/".concat(conversation.id, "/messages"), {
        method: "POST",
        body: JSON.stringify(pending.payload)
      });
      if (state.pendingSends.get(key) === pending) state.pendingSends.delete(key);
      return result;
    });
  }
  function compressImage(file) {
    return __async(this, null, function* () {
      if (!file.type.startsWith("image/") || file.type === "image/gif") return file;
      if (file.size < 400 * 1024) return file;
      const bitmap = yield createImageBitmap(file);
      const maxSide = 1600;
      const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
      const width = Math.max(1, Math.round(bitmap.width * scale));
      const height = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d", { alpha: false }).drawImage(bitmap, 0, 0, width, height);
      bitmap.close();
      const blob = yield new Promise((resolve) => canvas.toBlob(resolve, "image/webp", 0.82));
      if (!blob || blob.size >= file.size) return file;
      return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".webp", { type: "image/webp" });
    });
  }
  var pendingFiles = /* @__PURE__ */ new WeakMap();
  function sendFile(file) {
    return __async(this, null, function* () {
      var _a11, _b, _c;
      let pending = pendingFiles.get(file);
      const conversation = (pending == null ? void 0 : pending.conversation) || state.activeConversation;
      if (!conversation || !file || !canPostToConversation(conversation)) return;
      if (file.size > 50 * 1024 * 1024) {
        showToast(bt("tooLarge"));
        return;
      }
      ui.attachButton.disabled = true;
      showToast(bt("upload"), 6e3);
      try {
        if (!pending) {
          let prepared = file;
          try {
            prepared = yield compressImage(file);
          } catch (e) {
          }
          const roomKey = yield unlockConversationKey(conversation);
          const encrypted = yield encryptBytes(roomKey, yield prepared.arrayBuffer());
          pending = { conversation, roomKey, prepared, encrypted, replyToId: ((_a11 = state.replyTo) == null ? void 0 : _a11.id) || null, clientMessageId: crypto.randomUUID() };
          pendingFiles.set(file, pending);
        }
        if (!pending.upload) {
          pending.upload = yield api("/api/conversations/".concat(conversation.id, "/attachments"), { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: pending.encrypted.ciphertext });
        }
        if (!pending.payload) {
          const f = pending.prepared;
          const body = { version: 1, text: "", attachment: { id: pending.upload.id, iv: pending.encrypted.iv, name: f.name, mime: f.type || "application/octet-stream", size: f.size, kind: f.type.startsWith("image/") ? "image" : f.type.startsWith("video/") ? "video" : f.type.startsWith("audio/") ? "audio" : "file" } };
          pending.payload = __spreadProps(__spreadValues({}, yield encryptJson(pending.roomKey, body)), { clientMessageId: pending.clientMessageId, attachmentId: pending.upload.id, replyToId: pending.replyToId });
          pending.encrypted = null;
        }
        const result = yield api("/api/conversations/".concat(conversation.id, "/messages"), { method: "POST", body: JSON.stringify(pending.payload) });
        yield appendMessage(result.message, pending.roomKey);
        pendingFiles.delete(file);
        yield loadConversations();
        if (((_b = state.activeConversation) == null ? void 0 : _b.id) === conversation.id) {
          ui.messageList.scrollTop = ui.messageList.scrollHeight;
          if (((_c = state.replyTo) == null ? void 0 : _c.id) === pending.replyToId) clearComposerContext();
        }
      } finally {
        ui.attachButton.disabled = !canPostToConversation(state.activeConversation);
      }
    });
  }
  function showFileRetry(file, error) {
    const toast = document.createElement("div");
    toast.className = "upload-retry";
    const text = document.createElement("span");
    text.textContent = file.name + " \u2014 " + (error.status === 413 ? bt("tooLarge") : t("serverError"));
    const retry = document.createElement("button");
    retry.textContent = bt("retry");
    retry.onclick = () => __async(null, null, function* () {
      retry.disabled = true;
      try {
        yield sendFile(file);
        toast.remove();
      } catch (e) {
        retry.disabled = false;
      }
    });
    const close = document.createElement("button");
    close.textContent = "\u2715";
    close.onclick = () => {
      pendingFiles.delete(file);
      toast.remove();
    };
    toast.append(text, retry, close);
    document.body.append(toast);
  }
  function parseChatRoute() {
    if (location.pathname.startsWith("/invite/")) return null;
    let raw = "";
    try {
      raw = decodeURIComponent(location.hash.replace(/^#/, "").trim());
    } catch (e) {
      raw = location.hash.replace(/^#/, "").trim();
    }
    const username = raw.match(/^@([A-Za-z][A-Za-z0-9_]{3,31})$/);
    if (username) return { type: "username", username: username[1].toLowerCase() };
    const numeric = raw.match(/^-?(\d{1,20})$/);
    if (numeric) return { type: "chat", publicId: numeric[1].replace(/^0+(?=\d)/, "") };
    return null;
  }
  function conversationHash(conversation) {
    const peer = directPeer(conversation);
    if (conversation.kind === "direct" && (peer == null ? void 0 : peer.username)) return "#@".concat(peer.username);
    if (conversation.public_id != null) return "#".concat(conversation.public_id);
    return "";
  }
  function syncConversationUrl(conversation) {
    const hash = conversationHash(conversation);
    if (!hash || location.hash.toLowerCase() === hash.toLowerCase()) return;
    history.pushState({ conversation: String(conversation.public_id || conversation.id) }, "", "/".concat(hash));
  }
  function openUsernameChat(_0) {
    return __async(this, arguments, function* (username, { syncUrl = false } = {}) {
      const normalized = String(username || "").replace(/^@/, "").toLowerCase();
      const known = state.conversations.find((c) => {
        var _a11, _b;
        return c.kind === "direct" && ((_b = (_a11 = directPeer(c)) == null ? void 0 : _a11.username) == null ? void 0 : _b.toLowerCase()) === normalized;
      });
      if (known) return openConversation(known.id, { syncUrl });
      const info = yield api("/api/users/by-username/".concat(encodeURIComponent(normalized)));
      const peer = info.user;
      if (peer.id === state.me.id) {
        openProfile();
        return;
      }
      const roomKey = yield generateRoomKey();
      const context = "direct:".concat(crypto.randomUUID());
      const selfWrapped = yield wrapRoomKey(roomKey, state.privateKey, state.me.public_key_jwk, context);
      const peerWrapped = yield wrapRoomKey(roomKey, state.privateKey, peer.public_key_jwk, context);
      const created = yield api("/api/direct/by-username/".concat(encodeURIComponent(normalized)), {
        method: "POST",
        body: JSON.stringify({
          selfEnvelope: { iv: selfWrapped.iv, ciphertext: JSON.stringify({ context, data: selfWrapped.ciphertext }) },
          peerEnvelope: { iv: peerWrapped.iv, ciphertext: JSON.stringify({ context, data: peerWrapped.ciphertext }) }
        })
      });
      if (!created.existing) state.roomKeys.set(created.conversationId, roomKey);
      yield loadConversations();
      return openConversation(created.conversationId, { syncUrl });
    });
  }
  function closeActiveConversationFromRoute() {
    var _a11;
    if (state.activeConversation) {
      state.drafts.set(state.activeConversation.id, { text: ui.messageInput.value, reply: state.replyTo, editing: state.editingMessage });
    }
    state.activeConversation = null;
    cancelVoiceRecording();
    (_a11 = $("pinnedMessageBar")) == null ? void 0 : _a11.classList.add("hidden");
    resetMessageView(ui.messageList, state.messageView);
    resetMessageView(ui.threadMessageList, state.threadView);
    state.messageCache.clear();
    ui.activeChat.classList.add("hidden");
    ui.emptyChat.classList.remove("hidden");
    ui.chatPane.classList.add("empty");
    ui.appView.classList.remove("chat-open");
    renderConversationList();
  }
  function handleChatRoute() {
    return __async(this, null, function* () {
      if (!state.me || state.pendingInvite) return;
      const request = ++state.routeRequest;
      const route = parseChatRoute();
      if (!route) {
        closeActiveConversationFromRoute();
        return;
      }
      try {
        if (route.type === "username") {
          yield openUsernameChat(route.username, { syncUrl: false });
          return;
        }
        const conversation = state.conversations.find((c) => String(c.public_id) === route.publicId);
        if (request !== state.routeRequest) return;
        if (!conversation) return showToast(bt("chatNotFound"));
        yield openConversation(conversation.id, { syncUrl: false });
      } catch (error) {
        if (request !== state.routeRequest) return;
        showToast((error == null ? void 0 : error.status) === 404 ? bt("userNotFound") : t("serverError"));
      }
    });
  }
  var routeScheduled = false;
  function scheduleChatRoute() {
    if (routeScheduled) return;
    routeScheduled = true;
    queueMicrotask(() => {
      routeScheduled = false;
      handleChatRoute().catch(() => showToast(t("serverError")));
    });
  }
  function applyNativeUrl(rawUrl) {
    try {
      const url = new URL(rawUrl);
      let hash = url.hash || "";
      if (url.protocol === "m0d:") {
        const target = decodeURIComponent(url.pathname.replace(/^\//, ""));
        if (url.hostname === "user" && target) hash = "#@" + target.replace(/^@/, "");
        if (url.hostname === "chat" && /^\d+$/.test(target)) hash = "#" + target;
      }
      if (hash && location.hash !== hash) location.hash = hash;
    } catch (e) {
    }
  }
  function initNativeShell() {
    return __async(this, null, function* () {
      var _a11, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
      const cap = window.Capacitor;
      if (!((_a11 = cap == null ? void 0 : cap.isNativePlatform) == null ? void 0 : _a11.call(cap))) return;
      document.documentElement.classList.add("native-app");
      const App = (_b = cap.Plugins) == null ? void 0 : _b.App;
      const StatusBar = (_c = cap.Plugins) == null ? void 0 : _c.StatusBar;
      const LocalNotifications = (_d = cap.Plugins) == null ? void 0 : _d.LocalNotifications;
      const syncViewport = () => {
        var _a12;
        const height = Math.round(((_a12 = window.visualViewport) == null ? void 0 : _a12.height) || window.innerHeight);
        document.documentElement.style.setProperty("--native-app-height", "".concat(height, "px"));
      };
      syncViewport();
      (_e = window.visualViewport) == null ? void 0 : _e.addEventListener("resize", syncViewport);
      window.addEventListener("orientationchange", syncViewport);
      try {
        yield (_f = StatusBar == null ? void 0 : StatusBar.setOverlaysWebView) == null ? void 0 : _f.call(StatusBar, { overlay: false });
        yield (_g = StatusBar == null ? void 0 : StatusBar.setStyle) == null ? void 0 : _g.call(StatusBar, { style: "DARK" });
        yield (_h = StatusBar == null ? void 0 : StatusBar.setBackgroundColor) == null ? void 0 : _h.call(StatusBar, { color: "#0e1621" });
      } catch (e) {
      }
      if (!App) return;
      yield (_i = App.addListener) == null ? void 0 : _i.call(App, "appUrlOpen", (event) => applyNativeUrl((event == null ? void 0 : event.url) || ""));
      yield (_j = App.addListener) == null ? void 0 : _j.call(App, "appStateChange", (event) => {
        if (event == null ? void 0 : event.isActive) {
          syncViewport();
          connectSocket();
          scheduleCallMediaRepair(450);
        }
      });
      yield (_k = LocalNotifications == null ? void 0 : LocalNotifications.addListener) == null ? void 0 : _k.call(LocalNotifications, "localNotificationActionPerformed", (event) => {
        var _a12, _b2;
        const conversationId = (_b2 = (_a12 = event == null ? void 0 : event.notification) == null ? void 0 : _a12.extra) == null ? void 0 : _b2.conversationId;
        if (!conversationId) return;
        if (state.me) openConversation(conversationId).catch(() => {
        });
        else state.pendingNativeConversation = conversationId;
      });
      yield (_l = App.addListener) == null ? void 0 : _l.call(App, "backButton", () => {
        var _a12, _b2, _c2, _d2;
        const viewer = document.querySelector(".media-viewer");
        if (viewer) return viewer.remove();
        const crop = document.querySelector(".avatar-crop-modal");
        if (crop) return (_a12 = crop.querySelector(".crop-cancel")) == null ? void 0 : _a12.click();
        const profile = document.querySelector(".profile-modal");
        if (profile) return (_b2 = profile.querySelector(".profile-close")) == null ? void 0 : _b2.click();
        if (!((_c2 = ui.mobileCallsView) == null ? void 0 : _c2.classList.contains("hidden"))) return openMobileChats();
        if (!ui.settingsDrawer.classList.contains("hidden")) return openMobileChats();
        if (ui.sidebar.classList.contains("search-open")) {
          ui.sidebar.classList.remove("search-open");
          ui.chatSearch.blur();
          return;
        }
        if (!ui.chatInfoModal.classList.contains("hidden")) return ui.closeChatInfoButton.click();
        if (!ui.threadModal.classList.contains("hidden")) return ui.closeThreadButton.click();
        if (!ui.newChatModal.classList.contains("hidden")) return ui.closeNewChatButton.click();
        if (!ui.callOverlay.classList.contains("hidden")) return ui.minimizeCallButton.click();
        if (state.activeConversation || ui.appView.classList.contains("chat-open")) return ui.backButton.click();
        (_d2 = App.minimizeApp) == null ? void 0 : _d2.call(App);
      });
      try {
        const launch = yield (_m = App.getLaunchUrl) == null ? void 0 : _m.call(App);
        if (launch == null ? void 0 : launch.url) applyNativeUrl(launch.url);
      } catch (e) {
      }
    });
  }
  function capturePendingInvite() {
    const match = location.pathname.match(/^\/invite\/([A-Za-z0-9_-]+)\/?$/);
    const fragment = new URLSearchParams(location.hash.replace(/^#/, ""));
    const roomKey = fragment.get("k");
    state.pendingInvite = match && roomKey ? { token: match[1], roomKey } : null;
  }
  function syncNewChatMode() {
    const kind = ui.inviteKindInput.value;
    const structured = kind === "group" || kind === "channel";
    ui.groupTitleLabel.classList.toggle("hidden", !structured);
    ui.descriptionLabel.classList.toggle("hidden", !structured);
    ui.inviteResult.classList.add("hidden");
    ui.inviteLinkInput.value = "";
    if (kind === "direct") {
      ui.newChatHelp.dataset.i18n = "invitePrivacyHint";
      ui.createChatButton.dataset.i18n = "createInvite";
    } else if (kind === "group") {
      ui.newChatHelp.dataset.i18n = "groupCreateHint";
      ui.createChatButton.dataset.i18n = "createGroup";
    } else {
      ui.newChatHelp.dataset.i18n = "channelCreateHint";
      ui.createChatButton.dataset.i18n = "createChannel";
    }
    applyTranslations();
  }
  function createInvite() {
    return __async(this, null, function* () {
      ui.newChatError.textContent = "";
      ui.inviteResult.classList.add("hidden");
      const kind = ui.inviteKindInput.value;
      const title = ui.groupTitleInput.value.trim();
      const description = ui.descriptionInput.value.trim();
      if ((kind === "group" || kind === "channel") && !title) {
        ui.newChatError.textContent = t("groupNameRequired");
        return;
      }
      ui.createChatButton.disabled = true;
      try {
        const roomKey = yield generateRoomKey();
        if (kind === "direct") {
          const exported = yield exportRoomKey(roomKey);
          const result2 = yield api("/api/invites", {
            method: "POST",
            body: JSON.stringify({ kind: "direct" })
          });
          const link = "".concat(location.origin, "/invite/").concat(result2.token, "#k=").concat(encodeURIComponent(exported));
          ui.inviteLinkInput.value = link;
          ui.inviteResult.classList.remove("hidden");
          ui.createChatButton.dataset.i18n = "createAnotherInvite";
          applyTranslations();
          return;
        }
        const context = "create:".concat(crypto.randomUUID());
        const wrapped = yield wrapRoomKey(roomKey, state.privateKey, state.me.public_key_jwk, context);
        const result = yield api("/api/conversations", {
          method: "POST",
          body: JSON.stringify({
            kind,
            title,
            description,
            commentsEnabled: true,
            selfEnvelope: {
              iv: wrapped.iv,
              ciphertext: JSON.stringify({ context, data: wrapped.ciphertext })
            }
          })
        });
        state.roomKeys.set(result.conversation.id, roomKey);
        ui.newChatModal.classList.add("hidden");
        ui.groupTitleInput.value = "";
        ui.descriptionInput.value = "";
        yield loadConversations();
        yield openConversation(result.conversation.id);
        showToast(kind === "channel" ? t("newChannelCreated") : t("newGroupCreated"));
      } catch (e) {
        ui.newChatError.textContent = kind === "direct" ? t("inviteCreateFailed") : t("chatCreateFailed");
      } finally {
        ui.createChatButton.disabled = false;
      }
    });
  }
  function acceptPendingInvite() {
    return __async(this, null, function* () {
      if (!state.pendingInvite || !state.me || !state.privateKey) return;
      const { token, roomKey: encodedRoomKey } = state.pendingInvite;
      try {
        const info = yield api("/api/invites/".concat(token));
        const invite = info.invite;
        if (invite.creator_id === state.me.id) {
          showToast(t("ownInvite"));
          return;
        }
        const roomKey = yield importRoomKey(encodedRoomKey);
        const context = "invite:".concat(token);
        const selfWrapped = yield wrapRoomKey(
          roomKey,
          state.privateKey,
          state.me.public_key_jwk,
          context
        );
        let creatorEnvelope = null;
        if (!invite.conversation_id) {
          const creatorWrapped = yield wrapRoomKey(
            roomKey,
            state.privateKey,
            invite.creator_public_key,
            context
          );
          creatorEnvelope = {
            iv: creatorWrapped.iv,
            ciphertext: JSON.stringify({ context, data: creatorWrapped.ciphertext })
          };
        }
        const accepted = yield api("/api/invites/".concat(token, "/accept"), {
          method: "POST",
          body: JSON.stringify({
            selfEnvelope: {
              iv: selfWrapped.iv,
              ciphertext: JSON.stringify({ context, data: selfWrapped.ciphertext })
            },
            creatorEnvelope
          })
        });
        state.pendingInvite = null;
        history.replaceState(null, "", "/");
        state.roomKeys.set(accepted.conversationId, roomKey);
        yield loadConversations();
        yield openConversation(accepted.conversationId);
        showToast(t("inviteAccepted"));
      } catch (e) {
        showToast(t("inviteInvalid"));
      }
    });
  }
  function roleLabel(role) {
    return t(role || "member");
  }
  function createConversationInvite(conversation) {
    return __async(this, null, function* () {
      if (!conversation || conversation.kind === "direct" || !canManageConversation(conversation)) {
        throw new Error("forbidden");
      }
      const roomKey = yield unlockConversationKey(conversation);
      const exported = yield exportRoomKey(roomKey);
      const result = yield api("/api/invites", {
        method: "POST",
        body: JSON.stringify({ conversationId: conversation.id, maxUses: 50 })
      });
      return "".concat(location.origin, "/invite/").concat(result.token, "#k=").concat(encodeURIComponent(exported));
    });
  }
  function renderChatInfo() {
    return __async(this, null, function* () {
      const conversation = state.activeConversation;
      if (!conversation) return;
      ui.infoTitle.textContent = conversationName(conversation);
      ui.infoSubtitle.textContent = conversation.public_id ? "".concat(conversationStatus(conversation), " \xB7 ID ").concat(conversation.public_id) : conversationStatus(conversation);
      ui.infoDescription.textContent = conversation.description || "";
      ui.infoDescription.classList.toggle("hidden", !conversation.description);
      ui.memberCount.textContent = String(conversation.members.length);
      ui.infoInviteResult.classList.add("hidden");
      const manageable = canManageConversation(conversation);
      ui.shareInviteButton.classList.toggle("hidden", conversation.kind === "direct" || !manageable);
      ui.editConversationButton.classList.toggle("hidden", conversation.kind === "direct" || !manageable);
      ui.leaveConversationButton.classList.toggle("hidden", myRole(conversation) === "owner");
      ui.muteConversationButton.dataset.i18n = conversation.notifications_enabled === false ? "unmuteChat" : "muteChat";
      ui.toggleCommentsButton.classList.toggle("hidden", conversation.kind !== "channel" || !manageable);
      ui.toggleCommentsButton.dataset.i18n = conversation.comments_enabled === false ? "enableComments" : "disableComments";
      applyTranslations();
      ui.memberList.replaceChildren();
      for (const member of conversation.members) {
        const row = document.createElement("div");
        row.className = "member-row";
        const avatar = document.createElement("div");
        avatar.className = "avatar small";
        paintAvatar(avatar, member);
        const meta = document.createElement("div");
        meta.className = "member-meta";
        const name = document.createElement("strong");
        name.textContent = member.id === state.me.id ? "".concat(member.displayName || member.display_name, " \xB7 ").concat(t("you")) : member.displayName || member.display_name;
        const role = document.createElement("span");
        role.textContent = "".concat(member.username ? "@" + member.username + " \xB7 " : "").concat(roleLabel(member.role));
        meta.append(name, role);
        row.append(avatar, meta);
        if (myRole(conversation) === "owner" && member.id !== state.me.id && member.role !== "owner") {
          const roleButton = document.createElement("button");
          roleButton.className = "mini-action";
          roleButton.type = "button";
          const admin = member.role === "admin";
          roleButton.textContent = admin ? "\u2212A" : "+A";
          roleButton.title = admin ? t("removeAdmin") : t("makeAdmin");
          roleButton.addEventListener("click", () => __async(null, null, function* () {
            const nextRole = admin ? conversation.kind === "channel" ? "subscriber" : "member" : "admin";
            yield api("/api/conversations/".concat(conversation.id, "/members/").concat(member.id), {
              method: "PATCH",
              body: JSON.stringify({ role: nextRole })
            });
            yield loadConversations();
            yield renderChatInfo();
          }));
          row.appendChild(roleButton);
        }
        if (manageable && member.id !== state.me.id && member.role !== "owner") {
          const remove = document.createElement("button");
          remove.className = "mini-action danger";
          remove.type = "button";
          remove.textContent = "\u2715";
          remove.title = t("removeMember");
          remove.addEventListener("click", () => __async(null, null, function* () {
            yield api("/api/conversations/".concat(conversation.id, "/members/").concat(member.id), { method: "DELETE" });
            yield loadConversations();
            yield renderChatInfo();
          }));
          row.appendChild(remove);
        }
        ui.memberList.appendChild(row);
      }
    });
  }
  function openChatInfo() {
    return __async(this, null, function* () {
      if (!state.activeConversation) return;
      yield renderChatInfo();
      ui.chatInfoModal.classList.remove("hidden");
    });
  }
  function shareCurrentConversation() {
    return __async(this, null, function* () {
      const link = yield createConversationInvite(state.activeConversation);
      ui.infoInviteLink.value = link;
      ui.infoInviteResult.classList.remove("hidden");
    });
  }
  function editCurrentConversation() {
    return __async(this, null, function* () {
      const conversation = state.activeConversation;
      if (!conversation || !canManageConversation(conversation)) return;
      const title = window.prompt(t("groupName"), conversation.title || "");
      if (title === null) return;
      const description = window.prompt(t("description"), conversation.description || "");
      if (description === null) return;
      yield api("/api/conversations/".concat(conversation.id), {
        method: "PATCH",
        body: JSON.stringify({
          title,
          description,
          commentsEnabled: conversation.comments_enabled !== false
        })
      });
      yield loadConversations();
      updateChatHeader();
      yield renderChatInfo();
    });
  }
  function toggleConversationNotifications() {
    return __async(this, null, function* () {
      const conversation = state.activeConversation;
      if (!conversation) return;
      const enabled = conversation.notifications_enabled === false;
      yield api("/api/conversations/".concat(conversation.id, "/settings"), {
        method: "PATCH",
        body: JSON.stringify({ notificationsEnabled: enabled })
      });
      conversation.notifications_enabled = enabled;
      yield renderChatInfo();
    });
  }
  function toggleChannelComments() {
    return __async(this, null, function* () {
      const conversation = state.activeConversation;
      if (!conversation || conversation.kind !== "channel" || !canManageConversation(conversation)) return;
      const enabled = conversation.comments_enabled === false;
      yield api("/api/conversations/".concat(conversation.id), {
        method: "PATCH",
        body: JSON.stringify({ commentsEnabled: enabled })
      });
      yield loadConversations();
      updateChatHeader();
      yield renderChatInfo();
      yield loadMessages();
    });
  }
  function requestBrowserNotifications() {
    return __async(this, null, function* () {
      var _a11, _b, _c;
      const local = (_b = (_a11 = window.Capacitor) == null ? void 0 : _a11.Plugins) == null ? void 0 : _b.LocalNotifications;
      if (local) {
        let permission2 = yield local.checkPermissions();
        if (permission2.display !== "granted") permission2 = yield local.requestPermissions();
        if (permission2.display === "granted") {
          yield (_c = local.createChannel) == null ? void 0 : _c.call(local, {
            id: "messages",
            name: "\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044F",
            description: "\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044F \u0438 \u0437\u0432\u043E\u043D\u043A\u0438 M0D",
            importance: 5,
            visibility: 1,
            vibration: true
          }).catch(() => {
          });
          ui.enableNotificationsButton.dataset.i18n = "notificationsEnabled";
          applyTranslations();
        }
        return;
      }
      if (!("Notification" in window)) return;
      const permission = yield Notification.requestPermission();
      if (permission === "granted") {
        ui.enableNotificationsButton.dataset.i18n = "notificationsEnabled";
        applyTranslations();
      }
    });
  }
  function showNativeNotification(_0, _1, _2) {
    return __async(this, arguments, function* (title, body, conversationId, idSeed = Date.now()) {
      var _a11, _b;
      const local = (_b = (_a11 = window.Capacitor) == null ? void 0 : _a11.Plugins) == null ? void 0 : _b.LocalNotifications;
      if (!local || !document.hidden) return false;
      const permission = yield local.checkPermissions().catch(() => ({ display: "denied" }));
      if (permission.display !== "granted") return false;
      const id = Math.max(1, Math.abs(Number(idSeed) || Date.now()) % 2147483e3);
      yield local.schedule({
        notifications: [{
          id,
          title,
          body,
          channelId: "messages",
          smallIcon: "ic_stat_m0d",
          extra: { conversationId }
        }]
      }).catch(() => {
      });
      return true;
    });
  }
  function maybeNotifyIncoming(conversation, message) {
    var _a11, _b;
    if (!conversation || message.sender_id === state.me.id || conversation.notifications_enabled === false) return;
    if (!document.hidden) return;
    if ((_b = (_a11 = window.Capacitor) == null ? void 0 : _a11.Plugins) == null ? void 0 : _b.LocalNotifications) {
      showNativeNotification(conversationName(conversation), t("newMessageNotification"), conversation.id, message.id).catch(() => {
      });
      return;
    }
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    const notification = new Notification(conversationName(conversation), {
      body: t("newMessageNotification"),
      icon: "/brand-app-icon.svg",
      tag: "m0d-".concat(conversation.id)
    });
    notification.onclick = () => {
      window.focus();
      openConversation(conversation.id).catch(() => {
      });
      notification.close();
    };
  }
  function leaveCurrentConversation() {
    return __async(this, null, function* () {
      const conversation = state.activeConversation;
      if (!conversation || myRole(conversation) === "owner") return;
      yield api("/api/conversations/".concat(conversation.id, "/members/me"), { method: "DELETE" });
      ui.chatInfoModal.classList.add("hidden");
      state.activeConversation = null;
      ui.activeChat.classList.add("hidden");
      ui.emptyChat.classList.remove("hidden");
      ui.chatPane.classList.add("empty");
      ui.appView.classList.remove("chat-open");
      yield loadConversations();
    });
  }
  function openThread(message, body) {
    return __async(this, null, function* () {
      var _a11;
      const conversation = state.activeConversation;
      if (!conversation || conversation.kind !== "channel" || conversation.comments_enabled === false) return;
      resetMessageView(ui.threadMessageList, state.threadView);
      state.threadRoot = message;
      state.threadReplyTo = null;
      state.threadEditingMessage = null;
      ui.threadSubtitle.textContent = ((_a11 = body == null ? void 0 : body.text) == null ? void 0 : _a11.slice(0, 100)) || "#".concat(message.id);
      ui.threadInput.value = "";
      ui.threadModal.classList.remove("hidden");
      yield loadThreadMessages();
    });
  }
  function loadThreadMessages() {
    return __async(this, null, function* () {
      const conversation = state.activeConversation;
      const root = state.threadRoot;
      if (!conversation || !root) return;
      const view = state.threadView;
      const epoch = view.epoch;
      const request = ++view.request;
      const writes = new Map(view.writes);
      const current2 = () => {
        var _a11;
        return ((_a11 = state.activeConversation) == null ? void 0 : _a11.id) === conversation.id && state.threadRoot === root && view.epoch === epoch && view.request === request;
      };
      const follow = nearMessageBottom(ui.threadMessageList);
      const roomKey = yield unlockConversationKey(conversation);
      const result = yield api("/api/conversations/".concat(conversation.id, "/messages?threadRootId=").concat(root.id, "&limit=100"));
      if (!current2()) return;
      for (const message of result.messages || []) {
        const valid = () => current2() && view.writes.get(String(message.id)) === writes.get(String(message.id));
        yield appendMessage(message, roomKey, ui.threadMessageList, true, valid);
      }
      if (current2() && follow) ui.threadMessageList.scrollTop = ui.threadMessageList.scrollHeight;
    });
  }
  function sendThreadComment() {
    return __async(this, null, function* () {
      var _a11, _b, _c, _d;
      const conversation = state.activeConversation;
      const root = state.threadRoot;
      const draft = ui.threadInput.value;
      const text = draft.trim();
      if (state.sendingThread || !conversation || !root || !text) return;
      const editing = state.threadEditingMessage;
      const reply = state.threadReplyTo;
      state.sendingThread = true;
      ui.threadSendButton.disabled = true;
      try {
        const roomKey = yield unlockConversationKey(conversation);
        if (editing) {
          const encrypted = yield encryptJson(roomKey, { version: 1, text });
          yield api("/api/conversations/".concat(conversation.id, "/messages/").concat(editing.id), {
            method: "PATCH",
            body: JSON.stringify(encrypted)
          });
          if (state.threadRoot === root) yield loadThreadMessages();
        } else {
          const result = yield postTextMessage(conversation, roomKey, text, (reply == null ? void 0 : reply.id) || null, root.id);
          yield appendMessage(result.message, roomKey, ui.threadMessageList, true);
        }
        if (state.threadRoot === root && ui.threadInput.value === draft && state.threadEditingMessage === editing && state.threadReplyTo === reply) {
          state.threadEditingMessage = null;
          state.threadReplyTo = null;
          ui.threadInput.value = "";
          ui.threadSubtitle.textContent = ((_c = (_b = (_a11 = state.messageCache.get(Number(root.id))) == null ? void 0 : _a11.body) == null ? void 0 : _b.text) == null ? void 0 : _c.slice(0, 100)) || "#".concat(root.id);
        }
        if (state.threadRoot === root) ui.threadMessageList.scrollTop = ui.threadMessageList.scrollHeight;
        if (((_d = state.activeConversation) == null ? void 0 : _d.id) === conversation.id) yield loadMessages();
        yield loadConversations();
      } finally {
        state.sendingThread = false;
        ui.threadSendButton.disabled = false;
      }
    });
  }
  function connectSocket() {
    clearTimeout(state.reconnectTimer);
    if (!state.me) return;
    if (state.ws && state.ws.readyState <= 1) return;
    const protocol = location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket("".concat(protocol, "//").concat(location.host, "/ws"));
    state.ws = ws;
    ws.addEventListener("open", () => {
      if (state.ws !== ws) return;
      state.online.clear();
      loadConversations().then(() => __async(null, null, function* () {
        if (state.ws !== ws) return;
        yield loadMessages();
        if (state.threadRoot) yield loadThreadMessages();
        if (state.call.pc && state.call.state !== "idle" && state.call.pc.connectionState !== "connected") {
          scheduleCallRecovery(250);
        }
      })).catch(() => showToast(t("serverError")));
    });
    ws.addEventListener("message", (event) => __async(null, null, function* () {
      var _a11, _b, _c, _d, _e, _f, _g, _h, _i, _j;
      if (state.ws !== ws || !state.me) return;
      try {
        let message;
        try {
          message = JSON.parse(event.data);
        } catch (e) {
          return;
        }
        if (message.type === "presence") {
          if (message.online) state.online.add(message.userId);
          else state.online.delete(message.userId);
          updateChatHeader();
          renderConversationList();
          return;
        }
        if (message.type === "message") {
          const incoming = message.message;
          if (!(incoming == null ? void 0 : incoming.id) || state.seenMessages.has(String(incoming.id))) return;
          state.seenMessages.add(String(incoming.id));
          if (state.seenMessages.size > 2e3) state.seenMessages.delete(state.seenMessages.values().next().value);
          const sourceConversation = state.conversations.find((c) => c.id === incoming.conversation_id);
          maybeNotifyIncoming(sourceConversation, incoming);
          if (((_a11 = state.activeConversation) == null ? void 0 : _a11.id) === incoming.conversation_id) {
            const roomKey = yield unlockConversationKey(state.activeConversation);
            if (((_b = state.activeConversation) == null ? void 0 : _b.id) !== incoming.conversation_id) return;
            if (incoming.thread_root_id) {
              if (String((_c = state.threadRoot) == null ? void 0 : _c.id) === String(incoming.thread_root_id) && !ui.threadModal.classList.contains("hidden")) {
                const follow = nearMessageBottom(ui.threadMessageList);
                yield appendMessage(incoming, roomKey, ui.threadMessageList, true);
                if (follow) ui.threadMessageList.scrollTop = ui.threadMessageList.scrollHeight;
              }
              yield loadMessages();
            } else {
              const follow = nearMessageBottom(ui.messageList);
              yield appendMessage(incoming, roomKey);
              if (follow) {
                ui.messageList.scrollTop = ui.messageList.scrollHeight;
                markVisibleMessagesRead();
              }
            }
          }
          yield loadConversations();
          return;
        }
        if (message.type === "profile-updated") {
          if (message.userId === state.me.id) {
            const me = yield api("/api/me");
            Object.assign(state.me, me.user);
            syncMe();
          }
          yield loadConversations();
          updateChatHeader();
          return;
        }
        if (message.type === "typing") {
          if (((_d = state.activeConversation) == null ? void 0 : _d.id) === message.conversationId && message.userId !== state.me.id) {
            clearTimeout(state.remoteTypingTimer);
            ui.chatStatus.textContent = message.typing ? t("typing") : conversationStatus(state.activeConversation);
            if (message.typing) {
              state.remoteTypingTimer = setTimeout(() => updateChatHeader(), 2600);
            }
          }
          return;
        }
        if (message.type === "read") {
          const conversation = state.conversations.find((c) => c.id === message.conversationId);
          const member = (_e = conversation == null ? void 0 : conversation.members) == null ? void 0 : _e.find((item) => item.id === message.userId);
          if (member) member.lastReadMessageId = Math.max(Number(member.lastReadMessageId || 0), Number(message.messageId || 0));
          if (conversation && message.userId === state.me.id) {
            conversation.last_read_message_id = Math.max(Number(conversation.last_read_message_id || 0), Number(message.messageId || 0));
            if (Number(message.messageId) >= Number(conversation.last_message_id || 0)) conversation.unread_count = 0;
            renderConversationList();
          }
          if (((_f = state.activeConversation) == null ? void 0 : _f.id) === message.conversationId) updateReadReceipts();
          return;
        }
        if (["message-updated", "message-deleted", "message-reactions", "message-pinned"].includes(message.type)) {
          if (message.type === "message-pinned" || message.type === "message-deleted") refreshPinnedMessage().catch(() => {
          });
          if (((_g = state.activeConversation) == null ? void 0 : _g.id) === message.conversationId || ((_h = state.activeConversation) == null ? void 0 : _h.id) === ((_i = message.message) == null ? void 0 : _i.conversation_id)) {
            yield loadMessages();
            if (state.threadRoot && !ui.threadModal.classList.contains("hidden")) yield loadThreadMessages();
          }
          yield loadConversations();
          return;
        }
        if (["conversation-created", "conversation-updated", "member-role", "member-removed"].includes(message.type)) {
          yield loadConversations();
          updateChatHeader();
          if (!ui.chatInfoModal.classList.contains("hidden")) yield renderChatInfo();
          return;
        }
        if (message.type === "conversation-removed") {
          if (((_j = state.activeConversation) == null ? void 0 : _j.id) === message.conversationId) {
            state.activeConversation = null;
            ui.activeChat.classList.add("hidden");
            ui.emptyChat.classList.remove("hidden");
            ui.chatPane.classList.add("empty");
            ui.appView.classList.remove("chat-open");
          }
          yield loadConversations();
          return;
        }
        yield handleCallSignal(message);
      } catch (error) {
        console.error("M0D socket event failed", error);
      }
    }));
    ws.addEventListener("close", () => {
      if (state.ws === ws && state.me) state.reconnectTimer = setTimeout(connectSocket, 1600);
    });
  }
  function sendSignal(payload) {
    var _a11;
    if (((_a11 = state.ws) == null ? void 0 : _a11.readyState) === WebSocket.OPEN) {
      state.ws.send(JSON.stringify(payload));
      return true;
    }
    connectSocket();
    return false;
  }
  function sendTyping(typing, threadRootId = null) {
    var _a11;
    const conversation = state.activeConversation;
    if (!conversation || ((_a11 = state.ws) == null ? void 0 : _a11.readyState) !== WebSocket.OPEN) return;
    state.ws.send(JSON.stringify({
      type: "typing",
      conversationId: conversation.id,
      typing: Boolean(typing),
      threadRootId
    }));
  }
  function pulseTyping(threadRootId = null) {
    sendTyping(true, threadRootId);
    clearTimeout(state.typingTimer);
    state.typingTimer = setTimeout(() => sendTyping(false, threadRootId), 1500);
  }
  function syncCallMini() {
    var _a11;
    if (!ui.callMiniBar) return;
    const active = state.call.state !== "idle";
    if (!active) {
      ui.callMiniBar.classList.add("hidden");
      return;
    }
    ui.callMiniName.textContent = ui.callPeerName.textContent || "M0D";
    ui.callMiniStatus.textContent = ui.callStatus.textContent || t("connecting");
    const audio = (_a11 = state.call.localStream) == null ? void 0 : _a11.getAudioTracks()[0];
    const muted = Boolean(audio && !audio.enabled);
    ui.miniMicButton.textContent = muted ? "\u{1F507}" : "\u{1F399}";
    ui.miniMicButton.classList.toggle("off", muted);
  }
  function minimizeCall() {
    if (state.call.state === "idle") return;
    ui.callOverlay.classList.add("hidden");
    ui.callMiniBar.classList.remove("hidden");
    syncCallMini();
  }
  function restoreCall() {
    if (state.call.state === "idle") return;
    ui.callMiniBar.classList.add("hidden");
    ui.callOverlay.classList.remove("hidden");
  }
  function showCallOverlay(name) {
    var _a11;
    ui.callPeerName.textContent = name;
    ui.callBackdropAvatar.textContent = firstLetter(name);
    ui.callBackdropAvatar.classList.remove("hidden");
    ui.remoteVideo.style.visibility = "hidden";
    (_a11 = ui.callMiniBar) == null ? void 0 : _a11.classList.add("hidden");
    ui.callOverlay.classList.remove("hidden");
  }
  function startNativeCallKeepAlive(video = false) {
    return __async(this, null, function* () {
      var _a11, _b;
      const plugin = (_b = (_a11 = window.Capacitor) == null ? void 0 : _a11.Plugins) == null ? void 0 : _b.CallKeepAlive;
      if (!(plugin == null ? void 0 : plugin.start)) return;
      yield plugin.start({ video: Boolean(video) }).catch(() => {
      });
    });
  }
  function updateNativeCallKeepAlive(video = false) {
    return __async(this, null, function* () {
      var _a11, _b;
      const plugin = (_b = (_a11 = window.Capacitor) == null ? void 0 : _a11.Plugins) == null ? void 0 : _b.CallKeepAlive;
      if (!(plugin == null ? void 0 : plugin.update)) return;
      yield plugin.update({ video: Boolean(video) }).catch(() => {
      });
    });
  }
  function stopNativeCallKeepAlive() {
    return __async(this, null, function* () {
      var _a11, _b;
      const plugin = (_b = (_a11 = window.Capacitor) == null ? void 0 : _a11.Plugins) == null ? void 0 : _b.CallKeepAlive;
      if (!(plugin == null ? void 0 : plugin.stop)) return;
      yield plugin.stop().catch(() => {
      });
    });
  }
  function liveMediaTrack(stream, kind) {
    return (stream == null ? void 0 : stream.getTracks().find((track) => track.kind === kind && track.readyState === "live")) || null;
  }
  function syncRemoteCallVisual() {
    var _a11;
    const stream = ui.remoteVideo.srcObject;
    const video = ((_a11 = stream == null ? void 0 : stream.getVideoTracks) == null ? void 0 : _a11.call(stream).find((track) => track.readyState === "live")) || null;
    const showingVideo = Boolean(video && !video.muted);
    ui.remoteVideo.style.visibility = showingVideo ? "visible" : "hidden";
    ui.callBackdropAvatar.classList.toggle("hidden", showingVideo);
  }
  function bindRemoteCallStream(stream) {
    if (!stream) return;
    ui.remoteVideo.srcObject = stream;
    for (const track of stream.getVideoTracks()) {
      track.onunmute = syncRemoteCallVisual;
      track.onmute = syncRemoteCallVisual;
      track.onended = syncRemoteCallVisual;
    }
    ui.remoteVideo.onloadeddata = syncRemoteCallVisual;
    syncRemoteCallVisual();
  }
  function armLocalVideoTrack(track) {
    if (!track) return;
    track.onunmute = () => {
      if (state.call.videoWanted && state.call.state !== "idle") {
        state.call.video = true;
        ui.localVideoFrame.classList.remove("hidden");
        refreshCallButtons();
      }
    };
    track.onmute = () => {
      if (state.call.videoWanted && !document.hidden) scheduleCallMediaRepair(900);
    };
    track.onended = () => {
      if (state.call.state === "idle") return;
      state.call.video = false;
      ui.localVideoFrame.classList.add("hidden");
      refreshCallButtons();
      if (state.call.videoWanted && !document.hidden) scheduleCallMediaRepair(350);
    };
  }
  function installLocalTrack(track) {
    return __async(this, null, function* () {
      var _a11;
      if (!track) return false;
      if (!state.call.localStream) state.call.localStream = new MediaStream();
      const oldTracks = state.call.localStream.getTracks().filter((item) => item.kind === track.kind && item !== track);
      for (const old of oldTracks) {
        state.call.localStream.removeTrack(old);
        try {
          old.stop();
        } catch (e) {
        }
      }
      if (!state.call.localStream.getTracks().includes(track)) state.call.localStream.addTrack(track);
      const pc = state.call.pc;
      if (!pc) return false;
      if (typeof pc.getSenders !== "function" || typeof pc.addTrack !== "function") {
        const streams = typeof pc.getLocalStreams === "function" ? pc.getLocalStreams() : [];
        for (const stream of streams) {
          try {
            (_a11 = pc.removeStream) == null ? void 0 : _a11.call(pc, stream);
          } catch (e) {
          }
        }
        if (typeof pc.addStream === "function") pc.addStream(state.call.localStream);
        return true;
      }
      const sender = pc.getSenders().find((item) => {
        var _a12;
        return ((_a12 = item.track) == null ? void 0 : _a12.kind) === track.kind;
      });
      if (sender) {
        yield sender.replaceTrack(track);
        return false;
      }
      pc.addTrack(track, state.call.localStream);
      return true;
    });
  }
  function reacquireCallAudio() {
    return __async(this, null, function* () {
      const stream = yield navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        video: false
      });
      const track = stream.getAudioTracks()[0];
      if (!track) throw new Error("no_audio_track");
      const needsRenegotiation = yield installLocalTrack(track);
      if (needsRenegotiation) yield renegotiateCall();
      return track;
    });
  }
  function reacquireCallVideo() {
    return __async(this, null, function* () {
      const stream = yield navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      const track = stream.getVideoTracks()[0];
      if (!track) throw new Error("no_camera_track");
      armLocalVideoTrack(track);
      const needsRenegotiation = yield installLocalTrack(track);
      state.call.video = true;
      yield updateNativeCallKeepAlive(true);
      ui.localVideo.srcObject = state.call.localStream;
      ui.localVideoFrame.classList.remove("hidden");
      refreshCallButtons();
      if (needsRenegotiation) yield renegotiateCall();
      return track;
    });
  }
  function scheduleCallMediaRepair(delay = 350) {
    clearTimeout(state.call.resumeRepairTimer);
    state.call.resumeRepairTimer = setTimeout(() => {
      repairActiveCallMedia().catch(() => {
      });
    }, delay);
  }
  function repairActiveCallMedia() {
    return __async(this, null, function* () {
      if (state.call.state === "idle" || state.call.state === "ringing" || state.call.mediaRepairing) return;
      state.call.mediaRepairing = true;
      try {
        connectSocket();
        yield startNativeCallKeepAlive(state.call.video);
        const pc = state.call.pc;
        if (pc && pc.connectionState !== "connected") scheduleCallRecovery(250);
        const audio = liveMediaTrack(state.call.localStream, "audio");
        if (!audio) yield reacquireCallAudio();
        const video = liveMediaTrack(state.call.localStream, "video");
        if (state.call.videoWanted && !state.call.screenStream && (!video || video.muted)) {
          yield reacquireCallVideo();
        } else if (video && state.call.videoWanted) {
          video.enabled = true;
          state.call.video = true;
          ui.localVideo.srcObject = state.call.localStream;
          ui.localVideoFrame.classList.remove("hidden");
        }
        yield applyAudioRoute();
        refreshCallButtons();
      } finally {
        state.call.mediaRepairing = false;
      }
    });
  }
  function acquireCallMedia(video) {
    return __async(this, null, function* () {
      try {
        state.call.localStream = yield navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
          video: video ? { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } } : false
        });
      } catch (e) {
        if (video) {
          state.call.localStream = yield navigator.mediaDevices.getUserMedia({
            audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
            video: false
          });
          showToast(t("noCamera"));
          state.call.video = false;
        } else {
          showToast(t("allowMicrophone"));
          throw new Error("media_denied");
        }
      }
      const videoTrack = liveMediaTrack(state.call.localStream, "video");
      if (videoTrack) armLocalVideoTrack(videoTrack);
      state.call.video = Boolean(videoTrack && videoTrack.enabled);
      ui.localVideo.srcObject = state.call.localStream;
      ui.localVideoFrame.classList.toggle("hidden", !state.call.video);
      refreshCallButtons();
    });
  }
  function startCall(video) {
    return __async(this, null, function* () {
      const conversation = state.activeConversation;
      const peer = directPeer(conversation);
      if (!peer || state.call.state !== "idle") return;
      state.call.state = "calling";
      state.call.peerId = peer.id;
      state.call.conversationId = conversation.id;
      state.call.video = Boolean(video);
      state.call.videoWanted = Boolean(video);
      state.call.speaker = Boolean(video);
      state.call.offerer = true;
      state.call.recoveryAttempts = 0;
      showCallOverlay(conversationName(conversation));
      ui.callStatus.textContent = t("calling");
      ui.incomingActions.classList.add("hidden");
      ui.activeCallControls.classList.remove("hidden");
      try {
        yield acquireCallMedia(video);
        yield startNativeCallKeepAlive(state.call.video);
        yield applyAudioRoute();
        sendSignal({
          type: "call-request",
          to: peer.id,
          conversationId: conversation.id,
          video: Boolean(video)
        });
      } catch (e) {
        finishCall(false);
      }
    });
  }
  function handleCallSignal(message) {
    return __async(this, null, function* () {
      var _a11;
      if (!["call-request", "call-accept", "call-decline", "call-unavailable", "offer", "answer", "ice", "hangup"].includes(message.type)) return;
      if (message.type === "call-unavailable") {
        if (state.call.state !== "idle") {
          showToast(t("offline"));
          finishCall(false);
        }
        return;
      }
      if (message.type === "call-request") {
        if (state.call.state !== "idle") {
          sendSignal({
            type: "call-decline",
            to: message.from,
            conversationId: message.conversationId
          });
          return;
        }
        const conversation = state.conversations.find((c) => c.id === message.conversationId);
        if (!conversation) return;
        showNativeNotification(
          conversationName(conversation),
          message.video ? "\u0412\u0445\u043E\u0434\u044F\u0449\u0438\u0439 \u0432\u0438\u0434\u0435\u043E\u0437\u0432\u043E\u043D\u043E\u043A" : "\u0412\u0445\u043E\u0434\u044F\u0449\u0438\u0439 \u0437\u0432\u043E\u043D\u043E\u043A",
          conversation.id,
          Date.now()
        ).catch(() => {
        });
        state.call.state = "ringing";
        state.call.peerId = message.from;
        state.call.conversationId = message.conversationId;
        state.call.video = Boolean(message.video);
        state.call.videoWanted = Boolean(message.video);
        state.call.speaker = Boolean(message.video);
        state.call.offerer = false;
        state.call.recoveryAttempts = 0;
        showCallOverlay(conversationName(conversation));
        ui.callStatus.textContent = t("incomingCall");
        ui.incomingActions.classList.remove("hidden");
        ui.activeCallControls.classList.add("hidden");
        return;
      }
      if (message.type === "call-decline") {
        if (state.call.state !== "idle") {
          showToast(t("callDeclined"));
          finishCall(false);
        }
        return;
      }
      if (message.type === "call-accept") {
        if (state.call.state === "calling") yield buildPeer(true);
        return;
      }
      if (message.type === "offer") {
        if (state.call.pc && state.call.pc.signalingState !== "closed") {
          yield state.call.pc.setRemoteDescription(message.sdp);
          yield flushPendingIce();
          const answer = yield state.call.pc.createAnswer();
          yield state.call.pc.setLocalDescription(answer);
          sendSignal({
            type: "answer",
            to: state.call.peerId,
            conversationId: state.call.conversationId,
            sdp: state.call.pc.localDescription
          });
        } else {
          yield buildPeer(false, message.sdp);
        }
        return;
      }
      if (message.type === "answer" && state.call.pc) {
        yield state.call.pc.setRemoteDescription(message.sdp);
        yield flushPendingIce();
        return;
      }
      if (message.type === "ice" && message.candidate) {
        if ((_a11 = state.call.pc) == null ? void 0 : _a11.remoteDescription) {
          try {
            yield state.call.pc.addIceCandidate(message.candidate);
          } catch (e) {
          }
        } else {
          state.call.pendingIce.push(message.candidate);
        }
        return;
      }
      if (message.type === "hangup") {
        showToast(t("callEnded"));
        finishCall(false);
      }
    });
  }
  function acceptIncomingCall() {
    return __async(this, null, function* () {
      if (state.call.state !== "ringing") return;
      const conversation = state.conversations.find((c) => c.id === state.call.conversationId);
      if (!conversation) return finishCall(false);
      ui.incomingActions.classList.add("hidden");
      ui.activeCallControls.classList.remove("hidden");
      ui.callStatus.textContent = t("connecting");
      state.call.state = "connecting";
      try {
        yield acquireCallMedia(state.call.video);
        yield startNativeCallKeepAlive(state.call.video);
        yield applyAudioRoute();
        sendSignal({
          type: "call-accept",
          to: state.call.peerId,
          conversationId: state.call.conversationId
        });
      } catch (e) {
        declineIncomingCall();
      }
    });
  }
  function declineIncomingCall() {
    if (state.call.peerId) {
      sendSignal({
        type: "call-decline",
        to: state.call.peerId,
        conversationId: state.call.conversationId
      });
    }
    finishCall(false);
  }
  function clearCallRecoveryTimers() {
    clearTimeout(state.call.recoveryTimer);
    clearTimeout(state.call.failureTimer);
    state.call.recoveryTimer = null;
    state.call.failureTimer = null;
  }
  function scheduleCallRecovery(delay = 1800) {
    var _a11;
    const pc = state.call.pc;
    if (!pc || state.call.state === "idle" || pc.connectionState === "closed") return;
    ui.callRoute.textContent = "ICE \xB7 reconnect";
    (_a11 = ui.callMiniBar) == null ? void 0 : _a11.classList.add("recovering");
    syncCallMini();
    if (!state.call.failureTimer) {
      state.call.failureTimer = setTimeout(() => {
        const current2 = state.call.pc;
        if (!current2 || state.call.state === "idle" || current2.connectionState === "connected") return;
        showToast(t("callEnded"));
        finishCall(true);
      }, 25e3);
    }
    if (!state.call.offerer) return;
    clearTimeout(state.call.recoveryTimer);
    state.call.recoveryTimer = setTimeout(() => {
      recoverCallConnection().catch(() => {
        if (state.call.state !== "idle") scheduleCallRecovery(1800);
      });
    }, delay);
  }
  function recoverCallConnection() {
    return __async(this, null, function* () {
      var _a11, _b;
      const pc = state.call.pc;
      if (!pc || state.call.state === "idle" || !state.call.offerer) return;
      if (pc.connectionState === "connected") {
        clearCallRecoveryTimers();
        state.call.recoveryAttempts = 0;
        return;
      }
      if (state.call.recoveryAttempts >= 5) return;
      if (((_a11 = state.ws) == null ? void 0 : _a11.readyState) !== WebSocket.OPEN) {
        connectSocket();
        scheduleCallRecovery(1500);
        return;
      }
      if (pc.signalingState !== "stable") {
        scheduleCallRecovery(900);
        return;
      }
      state.call.recoveryAttempts += 1;
      (_b = pc.restartIce) == null ? void 0 : _b.call(pc);
      const offer = yield pc.createOffer({ iceRestart: true });
      yield pc.setLocalDescription(offer);
      sendSignal({
        type: "offer",
        to: state.call.peerId,
        conversationId: state.call.conversationId,
        sdp: pc.localDescription
      });
      ui.callRoute.textContent = "ICE \xB7 retry ".concat(state.call.recoveryAttempts);
      syncCallMini();
    });
  }
  function callConnectionRecovered() {
    var _a11;
    clearCallRecoveryTimers();
    state.call.recoveryAttempts = 0;
    if (!state.call.startedAt) state.call.startedAt = Date.now();
    state.call.state = "active";
    (_a11 = ui.callMiniBar) == null ? void 0 : _a11.classList.remove("recovering");
    startCallTimers();
    syncCallMini();
  }
  function buildPeer(offerer, remoteOffer = null) {
    return __async(this, null, function* () {
      if (!state.call.localStream) yield acquireCallMedia(state.call.video);
      closePeerOnly();
      const config = yield api("/api/ice");
      const pc = new RTCPeerConnection({
        iceServers: config.iceServers,
        iceCandidatePoolSize: 4,
        bundlePolicy: "max-bundle"
      });
      state.call.pc = pc;
      if (typeof pc.addTrack === "function") {
        for (const track of state.call.localStream.getTracks()) {
          pc.addTrack(track, state.call.localStream);
        }
      } else if (typeof pc.addStream === "function") {
        pc.addStream(state.call.localStream);
      }
      pc.ontrack = (event) => {
        const stream = event.streams[0] || new MediaStream([event.track]);
        bindRemoteCallStream(stream);
        applyAudioRoute();
      };
      pc.onaddstream = (event) => {
        bindRemoteCallStream(event.stream);
        applyAudioRoute();
      };
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          sendSignal({
            type: "ice",
            to: state.call.peerId,
            conversationId: state.call.conversationId,
            candidate: event.candidate
          });
        }
      };
      pc.onconnectionstatechange = () => {
        if (state.call.pc !== pc) return;
        if (pc.connectionState === "connected") {
          callConnectionRecovered();
          return;
        }
        if (pc.connectionState === "disconnected") {
          scheduleCallRecovery(2500);
          return;
        }
        if (pc.connectionState === "failed") {
          scheduleCallRecovery(0);
        }
      };
      pc.oniceconnectionstatechange = () => {
        if (state.call.pc !== pc) return;
        if (pc.iceConnectionState === "connected" || pc.iceConnectionState === "completed") {
          if (pc.connectionState === "connected") callConnectionRecovered();
        } else if (pc.iceConnectionState === "disconnected") {
          scheduleCallRecovery(2500);
        } else if (pc.iceConnectionState === "failed") {
          scheduleCallRecovery(0);
        }
      };
      state.call.state = "connecting";
      ui.callStatus.textContent = t("connecting");
      if (offerer) {
        const offer = yield pc.createOffer();
        yield pc.setLocalDescription(offer);
        sendSignal({
          type: "offer",
          to: state.call.peerId,
          conversationId: state.call.conversationId,
          sdp: pc.localDescription
        });
      } else {
        yield pc.setRemoteDescription(remoteOffer);
        yield flushPendingIce();
        const answer = yield pc.createAnswer();
        yield pc.setLocalDescription(answer);
        sendSignal({
          type: "answer",
          to: state.call.peerId,
          conversationId: state.call.conversationId,
          sdp: pc.localDescription
        });
      }
    });
  }
  function flushPendingIce() {
    return __async(this, null, function* () {
      var _a11;
      if (!((_a11 = state.call.pc) == null ? void 0 : _a11.remoteDescription)) return;
      const pending = state.call.pendingIce;
      state.call.pendingIce = [];
      for (const candidate of pending) {
        try {
          yield state.call.pc.addIceCandidate(candidate);
        } catch (e) {
        }
      }
    });
  }
  function startCallTimers() {
    clearInterval(state.call.timer);
    clearInterval(state.call.stats);
    const updateTimer = () => {
      if (!state.call.startedAt) return;
      const seconds = Math.floor((Date.now() - state.call.startedAt) / 1e3);
      ui.callStatus.textContent = "".concat(String(Math.floor(seconds / 60)).padStart(2, "0"), ":").concat(String(seconds % 60).padStart(2, "0"));
      syncCallMini();
    };
    updateTimer();
    updateCallStats();
    state.call.timer = setInterval(updateTimer, 1e3);
    state.call.stats = setInterval(updateCallStats, 2500);
  }
  function updateCallStats() {
    return __async(this, null, function* () {
      const pc = state.call.pc;
      if (!pc) return;
      try {
        const stats = yield pc.getStats();
        let pair = null;
        let local = null;
        for (const report of stats.values()) {
          if (report.type === "transport" && report.selectedCandidatePairId) {
            pair = stats.get(report.selectedCandidatePairId);
          }
        }
        if (!pair) {
          for (const report of stats.values()) {
            if (report.type === "candidate-pair" && report.nominated && report.state === "succeeded") {
              pair = report;
              break;
            }
          }
        }
        if (pair == null ? void 0 : pair.localCandidateId) local = stats.get(pair.localCandidateId);
        const relay = (local == null ? void 0 : local.candidateType) === "relay";
        const rtt = (pair == null ? void 0 : pair.currentRoundTripTime) ? Math.round(pair.currentRoundTripTime * 1e3) : null;
        ui.callRoute.textContent = rtt ? "".concat(relay ? "TURN" : "P2P", " \xB7 ").concat(rtt, " ms") : relay ? "TURN" : "P2P";
      } catch (e) {
      }
    });
  }
  function closePeerOnly() {
    if (!state.call.pc) return;
    state.call.pc.ontrack = null;
    state.call.pc.onicecandidate = null;
    state.call.pc.onconnectionstatechange = null;
    state.call.pc.oniceconnectionstatechange = null;
    state.call.pc.close();
    state.call.pc = null;
  }
  function finishCall(notify = true) {
    var _a11, _b, _c, _d, _e;
    if (notify && state.call.peerId) {
      sendSignal({
        type: "hangup",
        to: state.call.peerId,
        conversationId: state.call.conversationId
      });
    }
    clearCallRecoveryTimers();
    clearTimeout(state.call.resumeRepairTimer);
    closePeerOnly();
    clearInterval(state.call.timer);
    clearInterval(state.call.stats);
    (_d = (_c = (_b = (_a11 = window.Capacitor) == null ? void 0 : _a11.Plugins) == null ? void 0 : _b.AudioRoute) == null ? void 0 : _c.reset) == null ? void 0 : _d.call(_c).catch(() => {
    });
    stopNativeCallKeepAlive().catch(() => {
    });
    if (state.call.localStream) {
      for (const track of state.call.localStream.getTracks()) track.stop();
    }
    if (state.call.screenStream) {
      for (const track of state.call.screenStream.getTracks()) track.stop();
    }
    state.call = {
      state: "idle",
      peerId: null,
      conversationId: null,
      video: false,
      videoWanted: false,
      pc: null,
      localStream: null,
      screenStream: null,
      pendingIce: [],
      startedAt: 0,
      timer: null,
      stats: null,
      speaker: true,
      offerer: false,
      recoveryTimer: null,
      failureTimer: null,
      recoveryAttempts: 0,
      mediaRepairing: false,
      resumeRepairTimer: null
    };
    ui.remoteVideo.srcObject = null;
    ui.remoteVideo.style.visibility = "hidden";
    ui.callBackdropAvatar.classList.remove("hidden");
    ui.localVideo.srcObject = null;
    ui.callOverlay.classList.add("hidden");
    (_e = ui.callMiniBar) == null ? void 0 : _e.classList.add("hidden");
    ui.incomingActions.classList.add("hidden");
    ui.activeCallControls.classList.add("hidden");
  }
  function refreshCallButtons() {
    var _a11, _b;
    const audio = (_a11 = state.call.localStream) == null ? void 0 : _a11.getAudioTracks()[0];
    const video = (_b = state.call.localStream) == null ? void 0 : _b.getVideoTracks()[0];
    const muted = Boolean(audio && !audio.enabled);
    ui.micButton.classList.toggle("off", muted);
    ui.micButton.textContent = muted ? "\u{1F507}" : "\u{1F399}";
    ui.micButton.setAttribute("aria-pressed", String(muted));
    ui.cameraButton.classList.toggle("off", !video || !video.enabled);
    ui.speakerButton.textContent = state.call.speaker ? "\u{1F50A}" : "\u25D6";
    ui.speakerButton.title = state.call.speaker ? t("speaker") : t("earpiece");
    ui.speakerButton.setAttribute("aria-pressed", String(state.call.speaker));
    syncCallMini();
  }
  function toggleMic() {
    return __async(this, null, function* () {
      var _a11, _b, _c, _d, _e, _f, _g, _h;
      const track = (_a11 = state.call.localStream) == null ? void 0 : _a11.getAudioTracks()[0];
      if (!track) return;
      track.enabled = !track.enabled;
      const native = (_c = (_b = window.Capacitor) == null ? void 0 : _b.Plugins) == null ? void 0 : _c.AudioRoute;
      yield (_d = native == null ? void 0 : native.setMicrophoneMuted) == null ? void 0 : _d.call(native, { muted: !track.enabled }).catch(() => {
      });
      (_h = (_g = (_f = (_e = window.Capacitor) == null ? void 0 : _e.Plugins) == null ? void 0 : _f.Haptics) == null ? void 0 : _g.impact) == null ? void 0 : _h.call(_g, { style: "LIGHT" }).catch(() => {
      });
      refreshCallButtons();
    });
  }
  function renegotiateCall() {
    return __async(this, null, function* () {
      const pc = state.call.pc;
      if (!pc || pc.signalingState === "closed") return;
      const offer = yield pc.createOffer();
      yield pc.setLocalDescription(offer);
      sendSignal({
        type: "offer",
        to: state.call.peerId,
        conversationId: state.call.conversationId,
        sdp: pc.localDescription
      });
    });
  }
  function toggleCamera() {
    return __async(this, null, function* () {
      const track = liveMediaTrack(state.call.localStream, "video");
      if (track && track.enabled) {
        state.call.videoWanted = false;
        state.call.video = false;
        track.enabled = false;
        updateNativeCallKeepAlive(false).catch(() => {
        });
        ui.localVideoFrame.classList.add("hidden");
        refreshCallButtons();
        return;
      }
      state.call.videoWanted = true;
      try {
        if (track) {
          track.enabled = true;
          state.call.video = true;
          yield updateNativeCallKeepAlive(true);
          ui.localVideo.srcObject = state.call.localStream;
          ui.localVideoFrame.classList.remove("hidden");
          refreshCallButtons();
          return;
        }
        yield reacquireCallVideo();
      } catch (e) {
        state.call.video = false;
        showToast(t("noCamera"));
        refreshCallButtons();
      }
    });
  }
  function toggleScreen() {
    return __async(this, null, function* () {
      var _a11, _b;
      if (!((_a11 = navigator.mediaDevices) == null ? void 0 : _a11.getDisplayMedia)) return showToast(t("shareUnsupported"));
      if (state.call.screenStream) {
        yield stopScreenShare(true);
        return;
      }
      try {
        state.call.screenStream = yield navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
        const track = state.call.screenStream.getVideoTracks()[0];
        const sender = (_b = state.call.pc) == null ? void 0 : _b.getSenders().find((item) => {
          var _a12;
          return ((_a12 = item.track) == null ? void 0 : _a12.kind) === "video";
        });
        if (sender) yield sender.replaceTrack(track);
        ui.localVideo.srcObject = state.call.screenStream;
        ui.screenButton.classList.add("off");
        track.onended = () => stopScreenShare(true);
      } catch (e) {
      }
    });
  }
  function stopScreenShare(restore = false) {
    return __async(this, null, function* () {
      var _a11, _b;
      if (!state.call.screenStream) return;
      for (const track of state.call.screenStream.getTracks()) track.stop();
      state.call.screenStream = null;
      ui.screenButton.classList.remove("off");
      if (restore) {
        const camera = ((_a11 = state.call.localStream) == null ? void 0 : _a11.getVideoTracks()[0]) || null;
        const sender = (_b = state.call.pc) == null ? void 0 : _b.getSenders().find((item) => {
          var _a12;
          return ((_a12 = item.track) == null ? void 0 : _a12.kind) === "video";
        });
        if (sender && camera) yield sender.replaceTrack(camera);
        ui.localVideo.srcObject = state.call.localStream;
      }
    });
  }
  function applyAudioRoute() {
    return __async(this, null, function* () {
      var _a11, _b;
      refreshCallButtons();
      const native = (_b = (_a11 = window.Capacitor) == null ? void 0 : _a11.Plugins) == null ? void 0 : _b.AudioRoute;
      if (native == null ? void 0 : native.setSpeakerphone) {
        yield native.setSpeakerphone({ enabled: Boolean(state.call.speaker) }).catch(() => {
        });
        return;
      }
      if (typeof ui.remoteVideo.setSinkId === "function") {
        try {
          const devices = yield navigator.mediaDevices.enumerateDevices();
          const outputs = devices.filter((device) => device.kind === "audiooutput");
          if (!outputs.length) return;
          let target = outputs.find(
            (device) => state.call.speaker ? /speaker|громк|динамік/i.test(device.label) : /earpiece|receiver|communications|разговор|розмов/i.test(device.label)
          );
          target || (target = outputs.find((device) => device.deviceId === (state.call.speaker ? "default" : "communications")));
          target || (target = outputs[0]);
          yield ui.remoteVideo.setSinkId(target.deviceId);
          return;
        } catch (e) {
        }
      }
    });
  }
  function toggleSpeaker() {
    return __async(this, null, function* () {
      var _a11, _b, _c;
      state.call.speaker = !state.call.speaker;
      const hasNative = Boolean((_c = (_b = (_a11 = window.Capacitor) == null ? void 0 : _a11.Plugins) == null ? void 0 : _b.AudioRoute) == null ? void 0 : _c.setSpeakerphone);
      const hasSink = typeof ui.remoteVideo.setSinkId === "function";
      if (!hasNative && !hasSink) {
        state.call.speaker = !state.call.speaker;
        showToast(t("outputUnsupported"));
        return;
      }
      yield applyAudioRoute();
    });
  }
  function logout() {
    return __async(this, null, function* () {
      clearTimeout(state.reconnectTimer);
      const socket = state.ws;
      state.ws = null;
      socket == null ? void 0 : socket.close();
      try {
        yield api("/api/auth/logout", { method: "POST", body: "{}" });
      } catch (e) {
      }
      if (state.me) yield identityDelete(state.me.id);
      location.reload();
    });
  }
  function setMobileNavActive(button) {
    [ui.mobileProfileTab, ui.mobileCallsTab, ui.mobileChatsTab, ui.mobileSettingsTab].forEach((item) => item == null ? void 0 : item.classList.toggle("active", item === button));
  }
  function closeMobileCalls() {
    var _a11;
    (_a11 = ui.mobileCallsView) == null ? void 0 : _a11.classList.add("hidden");
  }
  function openMobileChats() {
    closeDrawer();
    closeMobileCalls();
    document.querySelectorAll(".profile-modal").forEach((node) => node.remove());
    setMobileNavActive(ui.mobileChatsTab);
    if (ui.appView.classList.contains("chat-open")) ui.backButton.click();
  }
  function openMobileCalls() {
    return __async(this, null, function* () {
      var _a11;
      closeDrawer();
      document.querySelectorAll(".profile-modal").forEach((node) => node.remove());
      setMobileNavActive(ui.mobileCallsTab);
      ui.mobileCallsView.classList.remove("hidden");
      ui.mobileCallsList.innerHTML = '<div class="mobile-call-empty">\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430\u2026</div>';
      try {
        const result = yield api("/api/calls");
        ui.mobileCallsList.replaceChildren();
        if (!((_a11 = result.calls) == null ? void 0 : _a11.length)) {
          const empty = document.createElement("div");
          empty.className = "mobile-call-empty";
          empty.textContent = "\u0417\u0432\u043E\u043D\u043A\u043E\u0432 \u043F\u043E\u043A\u0430 \u043D\u0435\u0442";
          ui.mobileCallsList.append(empty);
          return;
        }
        for (const call of result.calls) {
          const row = document.createElement("button");
          row.className = "mobile-call-row";
          row.type = "button";
          const avatar = document.createElement("div");
          avatar.className = "avatar";
          paintAvatar(avatar, { id: call.peer_id, display_name: call.peer_name, avatar_version: call.peer_avatar_version }, call.peer_name);
          const main = document.createElement("div");
          main.className = "mobile-call-main";
          const title = document.createElement("strong");
          title.textContent = call.peer_name || call.peer_username || "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C";
          const detail = document.createElement("span");
          const direction = call.direction === "outgoing" ? "\u0418\u0441\u0445\u043E\u0434\u044F\u0449\u0438\u0439" : "\u0412\u0445\u043E\u0434\u044F\u0449\u0438\u0439";
          const type = call.video ? "\u0432\u0438\u0434\u0435\u043E\u0437\u0432\u043E\u043D\u043E\u043A" : "\u0437\u0432\u043E\u043D\u043E\u043A";
          const duration = Number(call.duration || 0);
          detail.textContent = "".concat(direction, " ").concat(type).concat(duration ? " \xB7 " + Math.floor(duration / 60) + ":" + String(duration % 60).padStart(2, "0") : "");
          main.append(title, detail);
          const meta = document.createElement("span");
          meta.className = "mobile-call-meta";
          meta.textContent = shortTime(call.created_at);
          row.append(avatar, main, meta);
          row.onclick = () => {
            closeMobileCalls();
            setMobileNavActive(ui.mobileChatsTab);
            openConversation(call.conversation_id).catch(() => {
            });
          };
          ui.mobileCallsList.append(row);
        }
      } catch (e) {
        ui.mobileCallsList.innerHTML = '<div class="mobile-call-empty">\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0438\u0441\u0442\u043E\u0440\u0438\u044E \u0437\u0432\u043E\u043D\u043A\u043E\u0432</div>';
      }
    });
  }
  function openMobileSettings() {
    closeMobileCalls();
    document.querySelectorAll(".profile-modal").forEach((node) => node.remove());
    setMobileNavActive(ui.mobileSettingsTab);
    openDrawer();
  }
  function openMobileProfile() {
    closeMobileCalls();
    closeDrawer();
    setMobileNavActive(ui.mobileProfileTab);
    openProfile();
  }
  function openDrawer() {
    ui.settingsDrawer.classList.remove("hidden");
    ui.drawerBackdrop.classList.remove("hidden");
  }
  function closeDrawer() {
    ui.settingsDrawer.classList.add("hidden");
    ui.drawerBackdrop.classList.add("hidden");
  }
  function enterMessenger() {
    return __async(this, null, function* () {
      ui.authView.classList.add("hidden");
      ui.appView.classList.remove("hidden");
      ui.meName.textContent = state.me.display_name;
      ui.meEmail.textContent = state.me.email;
      syncMe();
      if ("Notification" in window && Notification.permission === "granted") {
        ui.enableNotificationsButton.dataset.i18n = "notificationsEnabled";
        applyTranslations();
      }
      state.roomKeys.clear();
      yield loadConversations();
      connectSocket();
      if (document.documentElement.classList.contains("native-app")) {
        requestBrowserNotifications().catch(() => {
        });
      }
      if (state.pendingNativeConversation) {
        const conversationId = state.pendingNativeConversation;
        state.pendingNativeConversation = null;
        yield openConversation(conversationId).catch(() => {
        });
      } else if (state.pendingInvite) yield acceptPendingInvite();
      else yield handleChatRoute();
    });
  }
  function boot() {
    return __async(this, null, function* () {
      applyTranslations();
      capturePendingInvite();
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/sw.js", { updateViaCache: "none" }).catch(() => {
        });
      }
      let result;
      try {
        result = yield api("/api/me");
      } catch (error) {
        ui.authView.classList.remove("hidden");
        if (state.pendingInvite) ui.authError.textContent = t("inviteAfterAuth");
        return;
      }
      state.me = result.user;
      state.privateKey = yield identityGet(state.me.id).catch(() => null);
      if (!state.privateKey) {
        yield api("/api/auth/logout", { method: "POST", body: "{}" }).catch(() => {
        });
        state.me = null;
        ui.authView.classList.remove("hidden");
        ui.authError.textContent = t("cryptoError");
        return;
      }
      yield enterMessenger();
    });
  }
  ui.loginTab.addEventListener("click", () => setAuthMode("login"));
  ui.registerTab.addEventListener("click", () => setAuthMode("register"));
  ui.authForm.addEventListener("submit", submitAuth);
  document.querySelectorAll(".language-button").forEach((button) => {
    button.addEventListener("click", () => __async(null, null, function* () {
      setLanguage(button.dataset.lang);
      updateChatHeader();
      yield renderConversationList();
      updateShellLabels();
      updateDateLabels(ui.messageList);
    }));
  });
  ui.newChatButton.addEventListener("click", () => {
    ui.newChatError.textContent = "";
    ui.inviteResult.classList.add("hidden");
    ui.inviteLinkInput.value = "";
    ui.groupTitleInput.value = "";
    ui.descriptionInput.value = "";
    syncNewChatMode();
    ui.newChatModal.classList.remove("hidden");
    setTimeout(() => ui.inviteKindInput.focus(), 50);
  });
  ui.closeNewChatButton.addEventListener("click", () => ui.newChatModal.classList.add("hidden"));
  ui.inviteKindInput.addEventListener("change", syncNewChatMode);
  ui.copyInviteButton.addEventListener("click", () => __async(null, null, function* () {
    if (!ui.inviteLinkInput.value) return;
    yield navigator.clipboard.writeText(ui.inviteLinkInput.value);
    showToast(t("linkCopied"));
  }));
  ui.createChatButton.addEventListener("click", createInvite);
  ui.newChatModal.addEventListener("click", (event) => {
    if (event.target === ui.newChatModal) ui.newChatModal.classList.add("hidden");
  });
  ui.menuButton.addEventListener("click", openDrawer);
  var _a;
  (_a = ui.mobileProfileTab) == null ? void 0 : _a.addEventListener("click", openMobileProfile);
  var _a2;
  (_a2 = ui.mobileCallsTab) == null ? void 0 : _a2.addEventListener("click", () => openMobileCalls().catch(() => {
  }));
  var _a3;
  (_a3 = ui.mobileChatsTab) == null ? void 0 : _a3.addEventListener("click", openMobileChats);
  var _a4;
  (_a4 = ui.mobileSettingsTab) == null ? void 0 : _a4.addEventListener("click", openMobileSettings);
  var _a5;
  (_a5 = ui.closeMobileCallsButton) == null ? void 0 : _a5.addEventListener("click", openMobileChats);
  var _a6;
  (_a6 = ui.mobileSearchButton) == null ? void 0 : _a6.addEventListener("click", () => {
    ui.sidebar.classList.toggle("search-open");
    if (ui.sidebar.classList.contains("search-open")) setTimeout(() => ui.chatSearch.focus(), 30);
  });
  ui.closeDrawerButton.addEventListener("click", () => {
    closeDrawer();
    if (document.documentElement.classList.contains("native-app")) setMobileNavActive(ui.mobileChatsTab);
  });
  ui.drawerBackdrop.addEventListener("click", closeDrawer);
  ui.enableNotificationsButton.addEventListener("click", () => requestBrowserNotifications().catch(() => {
  }));
  ui.logoutButton.addEventListener("click", logout);
  ui.muteConversationButton.addEventListener("click", () => toggleConversationNotifications().catch(() => showToast(t("serverError"))));
  ui.toggleCommentsButton.addEventListener("click", () => toggleChannelComments().catch(() => showToast(t("serverError"))));
  var _a7;
  (_a7 = ui.mobileChatFilters) == null ? void 0 : _a7.addEventListener("click", (event) => {
    const button = event.target.closest(".mobile-chat-filter");
    if (!button) return;
    state.mobileChatFilter = button.dataset.filter || "all";
    ui.mobileChatFilters.querySelectorAll(".mobile-chat-filter").forEach((item) => item.classList.toggle("active", item === button));
    renderConversationList().catch(() => {
    });
  });
  ui.chatSearch.addEventListener("input", renderConversationList);
  ui.chatSearch.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    const value = ui.chatSearch.value.trim();
    if (/^@[A-Za-z][A-Za-z0-9_]{3,31}$/.test(value)) {
      event.preventDefault();
      location.hash = value;
    } else if (/^-?\d{1,20}$/.test(value)) {
      event.preventDefault();
      location.hash = value;
    }
  });
  ui.backButton.addEventListener("click", () => {
    var _a11;
    if (location.hash && ((_a11 = history.state) == null ? void 0 : _a11.conversation)) history.back();
    else {
      history.replaceState(null, "", "/");
      scheduleChatRoute();
    }
  });
  ui.chatInfoButton.addEventListener("click", () => openChatInfo().catch(() => showToast(t("serverError"))));
  ui.closeChatInfoButton.addEventListener("click", () => ui.chatInfoModal.classList.add("hidden"));
  ui.chatInfoModal.addEventListener("click", (event) => {
    if (event.target === ui.chatInfoModal) ui.chatInfoModal.classList.add("hidden");
  });
  ui.shareInviteButton.addEventListener("click", () => shareCurrentConversation().catch(() => showToast(t("serverError"))));
  ui.copyInfoInviteButton.addEventListener("click", () => __async(null, null, function* () {
    if (!ui.infoInviteLink.value) return;
    yield navigator.clipboard.writeText(ui.infoInviteLink.value);
    showToast(t("linkCopied"));
  }));
  ui.editConversationButton.addEventListener("click", () => editCurrentConversation().catch(() => showToast(t("serverError"))));
  ui.leaveConversationButton.addEventListener("click", () => leaveCurrentConversation().catch(() => showToast(t("serverError"))));
  ui.cancelComposerContext.addEventListener("click", () => {
    clearComposerContext();
    ui.messageInput.value = "";
    autosizeComposer();
  });
  ui.closeThreadButton.addEventListener("click", () => {
    resetMessageView(ui.threadMessageList, state.threadView);
    ui.threadModal.classList.add("hidden");
    state.threadRoot = null;
    state.threadReplyTo = null;
    state.threadEditingMessage = null;
  });
  ui.threadModal.addEventListener("click", (event) => {
    if (event.target === ui.threadModal) ui.closeThreadButton.click();
  });
  ui.threadSendButton.addEventListener("click", () => sendThreadComment().catch(() => showToast(t("serverError"))));
  ui.threadInput.addEventListener("input", () => {
    var _a11;
    return pulseTyping(((_a11 = state.threadRoot) == null ? void 0 : _a11.id) || null);
  });
  ui.threadInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey && !event.isComposing && !event.repeat) {
      event.preventDefault();
      sendThreadComment().catch(() => showToast(t("serverError")));
    }
  });
  ui.messageInput.addEventListener("input", () => {
    autosizeComposer();
    pulseTyping();
  });
  ui.messageInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey && !event.isComposing && !event.repeat) {
      event.preventDefault();
      sendText().catch(() => showToast(t("serverError")));
    }
  });
  ui.sendButton.addEventListener("click", () => sendText().catch(() => showToast(t("serverError"))));
  ui.messageList.addEventListener("scroll", markVisibleMessagesRead, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && state.me) {
      connectSocket();
      markVisibleMessagesRead();
      scheduleCallMediaRepair(450);
    }
  });
  window.addEventListener("pageshow", () => {
    if (state.me) {
      connectSocket();
      scheduleCallMediaRepair(500);
    }
  });
  window.addEventListener("online", () => {
    connectSocket();
    scheduleCallMediaRepair(350);
  });
  window.addEventListener("hashchange", scheduleChatRoute);
  window.addEventListener("popstate", scheduleChatRoute);
  ui.attachButton.addEventListener("click", () => ui.fileInput.click());
  ui.fileInput.addEventListener("change", () => __async(null, null, function* () {
    const files = [...ui.fileInput.files || []];
    ui.fileInput.value = "";
    for (const file of files) {
      try {
        yield sendFile(file);
      } catch (e) {
        showFileRetry(file, e);
      }
    }
  }));
  ui.audioCallButton.addEventListener("click", () => startCall(false));
  ui.videoCallButton.addEventListener("click", () => startCall(true));
  ui.acceptCallButton.addEventListener("click", acceptIncomingCall);
  ui.declineCallButton.addEventListener("click", declineIncomingCall);
  ui.endCallButton.addEventListener("click", () => finishCall(true));
  ui.micButton.addEventListener("click", toggleMic);
  ui.cameraButton.addEventListener("click", toggleCamera);
  ui.screenButton.addEventListener("click", toggleScreen);
  ui.speakerButton.addEventListener("click", toggleSpeaker);
  ui.minimizeCallButton.addEventListener("click", minimizeCall);
  var _a8;
  (_a8 = ui.restoreCallButton) == null ? void 0 : _a8.addEventListener("click", restoreCall);
  var _a9;
  (_a9 = ui.miniMicButton) == null ? void 0 : _a9.addEventListener("click", toggleMic);
  var _a10;
  (_a10 = ui.miniEndCallButton) == null ? void 0 : _a10.addEventListener("click", () => finishCall(true));
  new MutationObserver(syncCallMini).observe(ui.callStatus, { childList: true, characterData: true, subtree: true });
  window.addEventListener("beforeunload", () => {
    if (state.call.state !== "idle" && state.call.peerId) {
      sendSignal({
        type: "hangup",
        to: state.call.peerId,
        conversationId: state.call.conversationId
      });
    }
  });
  setAuthMode("login");
  var basicsCopy = {
    ru: { profile: "\u041C\u043E\u0439 \u043F\u0440\u043E\u0444\u0438\u043B\u044C", name: "\u0418\u043C\u044F", username: "\u042E\u0437\u0435\u0440\u043D\u0435\u0439\u043C", hint: "4\u201332 \u0441\u0438\u043C\u0432\u043E\u043B\u0430: \u043B\u0430\u0442\u0438\u043D\u0441\u043A\u0438\u0435 \u0431\u0443\u043A\u0432\u044B, \u0446\u0438\u0444\u0440\u044B \u0438 _. \u041D\u0430\u0447\u043D\u0438\u0442\u0435 \u0441 \u0431\u0443\u043A\u0432\u044B.", photo: "\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u0444\u043E\u0442\u043E", remove: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0444\u043E\u0442\u043E", save: "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C", saved: "\u041F\u0440\u043E\u0444\u0438\u043B\u044C \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D", invalid_profile: "\u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0438\u043C\u044F \u0438 \u044E\u0437\u0435\u0440\u043D\u0435\u0439\u043C", username_taken: "\u042D\u0442\u043E\u0442 \u044E\u0437\u0435\u0440\u043D\u0435\u0439\u043C \u0443\u0436\u0435 \u0437\u0430\u043D\u044F\u0442", invalid_avatar: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043F\u0440\u043E\u0447\u0438\u0442\u0430\u0442\u044C \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435", upload: "\u041E\u0442\u043F\u0440\u0430\u0432\u043A\u0430 \u0444\u0430\u0439\u043B\u0430\u2026", tooLarge: "\u0424\u0430\u0439\u043B \u0431\u043E\u043B\u044C\u0448\u0435 50 \u041C\u0411", retry: "\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u044C \u043E\u0442\u043F\u0440\u0430\u0432\u043A\u0443", audio: "\u0410\u0443\u0434\u0438\u043E\u0437\u0432\u043E\u043D\u043E\u043A", video: "\u0412\u0438\u0434\u0435\u043E\u0437\u0432\u043E\u043D\u043E\u043A", ringing: "\u0412\u044B\u0437\u043E\u0432", missed: "\u0411\u0435\u0437 \u043E\u0442\u0432\u0435\u0442\u0430", declined: "\u041E\u0442\u043A\u043B\u043E\u043D\u0451\u043D", ended: "\u0417\u0430\u0432\u0435\u0440\u0448\u0451\u043D", connected: "\u0421\u043E\u0435\u0434\u0438\u043D\u0435\u043D\u0438\u0435", open: "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0444\u043E\u0442\u043E", chatNotFound: "\u0427\u0430\u0442 \u0441 \u0442\u0430\u043A\u0438\u043C ID \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D", userNotFound: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D" },
    en: { profile: "My profile", name: "Name", username: "Username", hint: "4\u201332 letters, digits or _. Start with a letter.", photo: "Change photo", remove: "Remove photo", save: "Save", saved: "Profile saved", invalid_profile: "Check name and username", username_taken: "Username is taken", invalid_avatar: "Cannot read image", upload: "Sending file\u2026", tooLarge: "File exceeds 50 MB", retry: "Retry upload", audio: "Voice call", video: "Video call", ringing: "Calling", missed: "No answer", declined: "Declined", ended: "Ended", connected: "Connected", open: "Open photo", chatNotFound: "Chat with this ID was not found", userNotFound: "User not found" },
    uk: { profile: "\u041C\u0456\u0439 \u043F\u0440\u043E\u0444\u0456\u043B\u044C", name: "\u0406\u043C\u2019\u044F", username: "\u042E\u0437\u0435\u0440\u043D\u0435\u0439\u043C", hint: "4\u201332 \u0441\u0438\u043C\u0432\u043E\u043B\u0438: \u043B\u0430\u0442\u0438\u043D\u0441\u044C\u043A\u0456 \u043B\u0456\u0442\u0435\u0440\u0438, \u0446\u0438\u0444\u0440\u0438 \u0442\u0430 _. \u041F\u043E\u0447\u043D\u0456\u0442\u044C \u0437 \u043B\u0456\u0442\u0435\u0440\u0438.", photo: "\u0417\u043C\u0456\u043D\u0438\u0442\u0438 \u0444\u043E\u0442\u043E", remove: "\u0412\u0438\u0434\u0430\u043B\u0438\u0442\u0438 \u0444\u043E\u0442\u043E", save: "\u0417\u0431\u0435\u0440\u0435\u0433\u0442\u0438", saved: "\u041F\u0440\u043E\u0444\u0456\u043B\u044C \u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043E", invalid_profile: "\u041F\u0435\u0440\u0435\u0432\u0456\u0440\u0442\u0435 \u0456\u043C\u2019\u044F \u0442\u0430 \u044E\u0437\u0435\u0440\u043D\u0435\u0439\u043C", username_taken: "\u0426\u0435\u0439 \u044E\u0437\u0435\u0440\u043D\u0435\u0439\u043C \u0432\u0436\u0435 \u0437\u0430\u0439\u043D\u044F\u0442\u0438\u0439", invalid_avatar: "\u041D\u0435 \u0432\u0434\u0430\u043B\u043E\u0441\u044F \u043F\u0440\u043E\u0447\u0438\u0442\u0430\u0442\u0438 \u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u043D\u044F", upload: "\u041D\u0430\u0434\u0441\u0438\u043B\u0430\u043D\u043D\u044F \u0444\u0430\u0439\u043B\u0443\u2026", tooLarge: "\u0424\u0430\u0439\u043B \u0431\u0456\u043B\u044C\u0448\u0438\u0439 \u0437\u0430 50 \u041C\u0411", retry: "\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0438 \u043D\u0430\u0434\u0441\u0438\u043B\u0430\u043D\u043D\u044F", audio: "\u0410\u0443\u0434\u0456\u043E\u0434\u0437\u0432\u0456\u043D\u043E\u043A", video: "\u0412\u0456\u0434\u0435\u043E\u0434\u0437\u0432\u0456\u043D\u043E\u043A", ringing: "\u0412\u0438\u043A\u043B\u0438\u043A", missed: "\u0411\u0435\u0437 \u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u0456", declined: "\u0412\u0456\u0434\u0445\u0438\u043B\u0435\u043D\u043E", ended: "\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043E", connected: "\u0417\u2019\u0454\u0434\u043D\u0430\u043D\u043D\u044F", open: "\u0412\u0456\u0434\u043A\u0440\u0438\u0442\u0438 \u0444\u043E\u0442\u043E", chatNotFound: "\u0427\u0430\u0442 \u0456\u0437 \u0442\u0430\u043A\u0438\u043C ID \u043D\u0435 \u0437\u043D\u0430\u0439\u0434\u0435\u043D\u043E", userNotFound: "\u041A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447\u0430 \u043D\u0435 \u0437\u043D\u0430\u0439\u0434\u0435\u043D\u043E" }
  };
  function bt(key) {
    var _a11;
    return ((_a11 = basicsCopy[getLanguage()]) == null ? void 0 : _a11[key]) || basicsCopy.en[key] || t("serverError");
  }
  function paintAvatar(host, user, label) {
    host.replaceChildren();
    host.textContent = firstLetter(label || (user == null ? void 0 : user.displayName) || (user == null ? void 0 : user.display_name) || "M");
    const version = (user == null ? void 0 : user.avatarVersion) || (user == null ? void 0 : user.avatar_version);
    if (version && (user == null ? void 0 : user.id)) {
      const img = document.createElement("img");
      img.alt = "";
      img.src = "/api/users/".concat(user.id, "/avatar?v=").concat(encodeURIComponent(version));
      img.addEventListener("error", () => img.remove());
      host.append(img);
    }
  }
  function syncMe() {
    ui.meName.textContent = state.me.display_name;
    ui.meEmail.textContent = state.me.username ? "@" + state.me.username : bt("profile");
    paintAvatar(ui.meAvatar, state.me);
  }
  function callText(event) {
    const duration = event.duration ? " \xB7 ".concat(Math.floor(event.duration / 60), ":").concat(String(event.duration % 60).padStart(2, "0")) : "";
    return (event.video ? "\u25C9 " : "\u260E ") + bt(event.video ? "video" : "audio") + " \xB7 " + bt(event.status) + duration;
  }
  function chooseAvatarCrop(file) {
    return __async(this, null, function* () {
      if (!file || !file.type.startsWith("image/")) throw new Error("invalid_avatar");
      const sourceUrl = URL.createObjectURL(file);
      try {
        const image = new Image();
        image.src = sourceUrl;
        yield image.decode();
        return yield new Promise((resolve) => {
          const modal = document.createElement("div");
          modal.className = "modal avatar-crop-modal";
          modal.innerHTML = '<div class="avatar-crop-card">\n        <header><div><h2>\u0424\u043E\u0442\u043E \u043F\u0440\u043E\u0444\u0438\u043B\u044F</h2><p>\u041F\u0435\u0440\u0435\u0442\u0430\u0449\u0438 \u0444\u043E\u0442\u043E \u0438 \u0432\u044B\u0431\u0435\u0440\u0438 \u043C\u0430\u0441\u0448\u0442\u0430\u0431</p></div><button type="button" class="round-icon crop-cancel">\u2715</button></header>\n        <div class="avatar-crop-stage"><img alt=""></div>\n        <label class="avatar-zoom"><span>\u041C\u0430\u0441\u0448\u0442\u0430\u0431</span><input type="range" min="1" max="3" step="0.01" value="1"></label>\n        <div class="avatar-crop-actions"><button type="button" class="secondary-button crop-cancel">\u041E\u0442\u043C\u0435\u043D\u0430</button><button type="button" class="primary-button crop-save">\u0412\u044B\u0431\u0440\u0430\u0442\u044C</button></div>\n      </div>';
          document.body.append(modal);
          const stage = modal.querySelector(".avatar-crop-stage");
          const preview = stage.querySelector("img");
          const slider = modal.querySelector("input[type=range]");
          preview.src = sourceUrl;
          let zoom = 1, offsetX = 0, offsetY = 0, dragging = false, lastX = 0, lastY = 0;
          const metrics = () => {
            const size = stage.clientWidth;
            const base = Math.max(size / image.naturalWidth, size / image.naturalHeight);
            const scale = base * zoom;
            return { size, scale, width: image.naturalWidth * scale, height: image.naturalHeight * scale };
          };
          const clamp = () => {
            const m = metrics();
            const maxX = Math.max(0, (m.width - m.size) / 2);
            const maxY = Math.max(0, (m.height - m.size) / 2);
            offsetX = Math.max(-maxX, Math.min(maxX, offsetX));
            offsetY = Math.max(-maxY, Math.min(maxY, offsetY));
          };
          const paint = () => {
            clamp();
            const m = metrics();
            preview.style.width = m.width + "px";
            preview.style.height = m.height + "px";
            preview.style.left = m.size / 2 - m.width / 2 + offsetX + "px";
            preview.style.top = m.size / 2 - m.height / 2 + offsetY + "px";
          };
          const close = (value) => {
            modal.remove();
            resolve(value);
          };
          modal.querySelectorAll(".crop-cancel").forEach((button) => button.onclick = () => close(null));
          slider.oninput = () => {
            zoom = Number(slider.value);
            paint();
          };
          stage.onpointerdown = (event) => {
            dragging = true;
            lastX = event.clientX;
            lastY = event.clientY;
            stage.setPointerCapture(event.pointerId);
          };
          stage.onpointermove = (event) => {
            if (!dragging) return;
            offsetX += event.clientX - lastX;
            offsetY += event.clientY - lastY;
            lastX = event.clientX;
            lastY = event.clientY;
            paint();
          };
          stage.onpointerup = stage.onpointercancel = () => {
            dragging = false;
          };
          modal.querySelector(".crop-save").onclick = () => __async(null, null, function* () {
            const m = metrics();
            const left = m.size / 2 - m.width / 2 + offsetX;
            const top = m.size / 2 - m.height / 2 + offsetY;
            const sx = Math.max(0, -left / m.scale);
            const sy = Math.max(0, -top / m.scale);
            const sourceSize = Math.min(image.naturalWidth - sx, image.naturalHeight - sy, m.size / m.scale);
            const canvas = document.createElement("canvas");
            canvas.width = canvas.height = 512;
            canvas.getContext("2d").drawImage(image, sx, sy, sourceSize, sourceSize, 0, 0, 512, 512);
            const blob = yield new Promise((done) => canvas.toBlob(done, "image/png"));
            close(blob);
          });
          requestAnimationFrame(paint);
        });
      } finally {
        URL.revokeObjectURL(sourceUrl);
      }
    });
  }
  function openProfile() {
    closeDrawer();
    document.querySelectorAll(".profile-modal").forEach((node) => node.remove());
    const modal = document.createElement("div");
    modal.className = "modal profile-modal";
    const form = document.createElement("form");
    form.className = "modal-card profile-card";
    form.innerHTML = "<header><h2>".concat(bt("profile"), '</h2><button type="button" class="round-icon profile-close">\u2715</button></header><div class="profile-photo-row"><div class="avatar large profile-preview"></div><button type="button" class="secondary-button choose-avatar">').concat(bt("photo"), '</button><button type="button" class="round-icon remove-avatar" title="').concat(bt("remove"), '">\u232B</button></div><input class="avatar-input" type="file" accept="image/*" hidden><label class="field"><span>').concat(bt("name"), '</span><input class="profile-name" maxlength="40" required></label><label class="field"><span>').concat(bt("username"), '</span><input class="profile-username" maxlength="32" pattern="[a-zA-Z][a-zA-Z0-9_]{3,31}" placeholder="@username" autocomplete="off"></label><p class="profile-hint">').concat(bt("hint"), '</p><p class="profile-error" role="status"></p><button class="primary-button profile-save" type="submit">').concat(bt("save"), "</button>");
    modal.append(form);
    document.body.append(modal);
    form.querySelector(".profile-name").value = state.me.display_name;
    form.querySelector(".profile-username").value = state.me.username || "";
    paintAvatar(form.querySelector(".profile-preview"), state.me);
    let avatar = null, remove = false, previewUrl = null, busy = false;
    const close = () => {
      if (busy) return;
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      modal.remove();
      if (document.documentElement.classList.contains("native-app")) setMobileNavActive(ui.mobileChatsTab);
    };
    form.querySelector(".profile-close").onclick = close;
    modal.onclick = (e) => {
      if (e.target === modal) close();
    };
    const input = form.querySelector(".avatar-input");
    form.querySelector(".choose-avatar").onclick = () => input.click();
    form.querySelector(".remove-avatar").onclick = () => {
      remove = true;
      avatar = null;
      paintAvatar(form.querySelector(".profile-preview"), null, state.me.display_name);
    };
    input.onchange = () => __async(null, null, function* () {
      try {
        const file = input.files[0];
        if (!file) return;
        if (file.size > 20 * 1024 * 1024) throw new Error("invalid_avatar");
        const cropped = yield chooseAvatarCrop(file);
        input.value = "";
        if (!cropped) return;
        avatar = cropped;
        remove = false;
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        previewUrl = URL.createObjectURL(avatar);
        const img = document.createElement("img");
        img.src = previewUrl;
        img.alt = "";
        form.querySelector(".profile-preview").replaceChildren(img);
      } catch (e) {
        form.querySelector(".profile-error").textContent = bt("invalid_avatar");
      }
    });
    form.onsubmit = (e) => __async(null, null, function* () {
      e.preventDefault();
      if (busy) return;
      busy = true;
      const controls = [...form.querySelectorAll("button,input")];
      controls.forEach((x) => x.disabled = true);
      try {
        const r = yield api("/api/me/profile", { method: "PATCH", body: JSON.stringify({ displayName: form.querySelector(".profile-name").value, username: form.querySelector(".profile-username").value }) });
        Object.assign(state.me, r.user);
        if (avatar) {
          const a = yield api("/api/me/avatar", { method: "PUT", headers: { "Content-Type": "image/png" }, body: avatar });
          state.me.avatar_version = a.avatar_version;
        } else if (remove) {
          yield api("/api/me/avatar", { method: "DELETE" });
          state.me.avatar_version = null;
        }
        syncMe();
        yield loadConversations();
        busy = false;
        close();
        showToast(bt("saved"));
      } catch (e2) {
        form.querySelector(".profile-error").textContent = bt(e2.code);
      } finally {
        busy = false;
        controls.forEach((x) => x.disabled = false);
      }
    });
  }
  ui.meAvatar.setAttribute("role", "button");
  ui.meAvatar.tabIndex = 0;
  ui.meAvatar.title = bt("profile");
  ui.meAvatar.addEventListener("click", openProfile);
  ui.meAvatar.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") openProfile();
  });
  var profileButton = document.createElement("button");
  profileButton.className = "settings-action";
  profileButton.textContent = bt("profile");
  profileButton.onclick = openProfile;
  ui.settingsDrawer.querySelector(".drawer-section").prepend(profileButton);
  var clearCacheButton = document.createElement("button");
  clearCacheButton.className = "settings-action";
  clearCacheButton.type = "button";
  clearCacheButton.textContent = "\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C \u043A\u044D\u0448";
  clearCacheButton.onclick = () => __async(null, null, function* () {
    if ("caches" in window) {
      const keys = yield caches.keys();
      yield Promise.all(keys.map((key) => caches.delete(key)));
    }
    showToast("\u041A\u044D\u0448 \u043E\u0447\u0438\u0449\u0435\u043D");
  });
  ui.settingsDrawer.querySelector(".drawer-section").append(clearCacheButton);
  var settingsLogoutButton = document.createElement("button");
  settingsLogoutButton.className = "settings-action settings-danger";
  settingsLogoutButton.type = "button";
  settingsLogoutButton.textContent = "\u0412\u044B\u0439\u0442\u0438 \u0438\u0437 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430";
  settingsLogoutButton.onclick = logout;
  ui.settingsDrawer.querySelector(".drawer-section").append(settingsLogoutButton);
  var versionNote = document.createElement("div");
  versionNote.className = "settings-version";
  versionNote.textContent = "M0D Android \xB7 0.2.0 dev";
  ui.settingsDrawer.append(versionNote);
  function updateDateLabels(host) {
    let previous = null;
    for (const row of host.querySelectorAll(".message-row")) {
      const date = new Date(row.dataset.createdAt);
      if (!Number.isFinite(date.getTime())) continue;
      const key = date.toDateString();
      if (key !== previous) row.dataset.dateLabel = new Intl.DateTimeFormat(getLanguage(), { day: "numeric", month: "long" }).format(date);
      else delete row.dataset.dateLabel;
      previous = key;
    }
  }
  var pinnedRequest = 0;
  function refreshPinnedMessage() {
    return __async(this, null, function* () {
      var _a11, _b, _c;
      const bar = $("pinnedMessageBar");
      if (!bar) return;
      const request = ++pinnedRequest;
      const conversation = state.activeConversation;
      bar.classList.add("hidden");
      if (!conversation || !conversation.pinned_count) return;
      try {
        const result = yield api("/api/conversations/".concat(conversation.id, "/pins"));
        const pin = (_a11 = result.messages) == null ? void 0 : _a11[0];
        if (!pin) return;
        const key = yield unlockConversationKey(conversation);
        const body = pin.system_event ? { text: callText(pin.system_event) } : yield decryptJson(key, pin);
        if (request !== pinnedRequest || conversation.id !== ((_b = state.activeConversation) == null ? void 0 : _b.id)) return;
        bar.textContent = "\u2316 " + (body.text || ((_c = body.attachment) == null ? void 0 : _c.name) || t("file"));
        bar.classList.remove("hidden");
        bar.onclick = () => __async(null, null, function* () {
          let row = ui.messageList.querySelector('[data-message-id="'.concat(pin.id, '"]'));
          if (!row) {
            yield appendMessage(pin, key);
            row = ui.messageList.querySelector('[data-message-id="'.concat(pin.id, '"]'));
          }
          row == null ? void 0 : row.scrollIntoView({ block: "center", behavior: "smooth" });
        });
      } catch (e) {
      }
    });
  }
  var voiceRecording = null;
  function cancelVoiceRecording() {
    var _a11;
    const active = voiceRecording;
    voiceRecording = null;
    if (!active) return;
    active.cancelled = true;
    if (active.recorder.state !== "inactive") active.recorder.stop();
    active.stream.getTracks().forEach((track) => track.stop());
    (_a11 = $("voiceMessageButton")) == null ? void 0 : _a11.classList.remove("recording");
  }
  function toggleVoiceMessage() {
    return __async(this, null, function* () {
      var _a11;
      if (voiceRecording) {
        voiceRecording.recorder.stop();
        return;
      }
      if (!state.activeConversation || !canPostToConversation(state.activeConversation)) return;
      const conversationId = state.activeConversation.id;
      const button = $("voiceMessageButton");
      button.disabled = true;
      try {
        const stream = yield navigator.mediaDevices.getUserMedia({ audio: true });
        if (((_a11 = state.activeConversation) == null ? void 0 : _a11.id) !== conversationId) {
          stream.getTracks().forEach((t2) => t2.stop());
          return;
        }
        const recorder = new MediaRecorder(stream);
        const active = { stream, recorder, conversationId, chunks: [], cancelled: false };
        voiceRecording = active;
        recorder.ondataavailable = (event) => {
          if (event.data.size) active.chunks.push(event.data);
        };
        recorder.onstop = () => __async(null, null, function* () {
          var _a12;
          clearTimeout(active.timeout);
          stream.getTracks().forEach((track) => track.stop());
          if (voiceRecording === active) voiceRecording = null;
          button.classList.remove("recording");
          if (active.cancelled || ((_a12 = state.activeConversation) == null ? void 0 : _a12.id) !== conversationId) return;
          const extension = recorder.mimeType.includes("mp4") ? "m4a" : "webm";
          const file = new File(active.chunks, "Voice-".concat(Date.now(), ".").concat(extension), { type: recorder.mimeType });
          if (file.size) yield sendFile(file).catch((error) => showFileRetry(file, error));
        });
        recorder.start();
        button.classList.add("recording");
        active.timeout = setTimeout(() => {
          if (recorder.state === "recording") recorder.stop();
        }, 12e4);
      } catch (e) {
        showToast(t("mediaError"));
      } finally {
        button.disabled = false;
      }
    });
  }
  function shellText(key) {
    const copy = { ru: { account: "\u0410\u043A\u043A\u0430\u0443\u043D\u0442", storage: "\u0414\u0430\u043D\u043D\u044B\u0435 \u0438 \u043F\u0430\u043C\u044F\u0442\u044C", cache: "\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C \u043A\u044D\u0448 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044F", cacheHint: "\u041F\u0435\u0440\u0435\u043F\u0438\u0441\u043A\u0430 \u0438 \u043A\u043B\u044E\u0447\u0438 \u0448\u0438\u0444\u0440\u043E\u0432\u0430\u043D\u0438\u044F \u0441\u043E\u0445\u0440\u0430\u043D\u044F\u0442\u0441\u044F.", logout: "\u0412\u044B\u0439\u0442\u0438 \u0438\u0437 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430", all: "\u0412\u0441\u0435", direct: "\u041B\u0438\u0447\u043D\u044B\u0435", group: "\u0413\u0440\u0443\u043F\u043F\u044B", channel: "\u041A\u0430\u043D\u0430\u043B\u044B", chats: "\u0427\u0430\u0442\u044B", calls: "\u0417\u0432\u043E\u043D\u043A\u0438" }, en: { account: "Account", storage: "Data and storage", cache: "Clear app cache", cacheHint: "Messages and encryption keys are kept.", logout: "Log out", all: "All", direct: "Direct", group: "Groups", channel: "Channels", chats: "Chats", calls: "Calls" }, uk: { account: "\u041E\u0431\u043B\u0456\u043A\u043E\u0432\u0438\u0439 \u0437\u0430\u043F\u0438\u0441", storage: "\u0414\u0430\u043D\u0456 \u0442\u0430 \u043F\u0430\u043C\u2019\u044F\u0442\u044C", cache: "\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u0438 \u043A\u0435\u0448 \u0437\u0430\u0441\u0442\u043E\u0441\u0443\u043D\u043A\u0443", cacheHint: "\u041B\u0438\u0441\u0442\u0443\u0432\u0430\u043D\u043D\u044F \u0442\u0430 \u043A\u043B\u044E\u0447\u0456 \u0448\u0438\u0444\u0440\u0443\u0432\u0430\u043D\u043D\u044F \u0437\u0431\u0435\u0440\u0435\u0436\u0443\u0442\u044C\u0441\u044F.", logout: "\u0412\u0438\u0439\u0442\u0438", all: "\u0423\u0441\u0456", direct: "\u041E\u0441\u043E\u0431\u0438\u0441\u0442\u0456", group: "\u0413\u0440\u0443\u043F\u0438", channel: "\u041A\u0430\u043D\u0430\u043B\u0438", chats: "\u0427\u0430\u0442\u0438", calls: "\u0414\u0437\u0432\u0456\u043D\u043A\u0438" } };
    return (copy[getLanguage()] || copy.en)[key];
  }
  function updateShellLabels() {
    for (const node of document.querySelectorAll("[data-shell-text]")) node.textContent = shellText(node.dataset.shellText);
    for (const node of document.querySelectorAll("[data-filter]")) node.textContent = shellText(node.dataset.filter);
    profileButton.textContent = bt("profile");
    clearCacheButton.textContent = shellText("cache");
    settingsLogoutButton.textContent = shellText("logout");
    const labels = [[ui.mobileProfileTab, bt("profile")], [ui.mobileCallsTab, shellText("calls")], [ui.mobileChatsTab, shellText("chats")], [ui.mobileSettingsTab, t("settings")]];
    for (const [button, label] of labels) if (button == null ? void 0 : button.lastElementChild) button.lastElementChild.textContent = label;
  }
  function setupMessengerUI() {
    var _a11, _b, _c;
    const language = ui.settingsDrawer.querySelector(".drawer-section");
    const section = (key) => {
      const node = document.createElement("section");
      node.className = "drawer-section";
      const title = document.createElement("span");
      title.dataset.shellText = key;
      node.append(title);
      return node;
    };
    const account = section("account");
    account.append(profileButton);
    language.before(account);
    const storage = section("storage");
    storage.append(clearCacheButton);
    const hint = document.createElement("p");
    hint.className = "settings-help";
    hint.dataset.shellText = "cacheHint";
    storage.append(hint);
    ui.settingsDrawer.querySelector(".drawer-note").before(storage);
    versionNote.before(settingsLogoutButton);
    updateShellLabels();
    const icons = {
      menuButton: '<path d="M4 6h16M4 12h16M4 18h16"/>',
      attachButton: '<path d="m8 13 7-7a3 3 0 0 1 4 4l-9 9a5 5 0 0 1-7-7l9-9m-5 13 8-8"/>',
      emojiButton: '<circle cx="12" cy="12" r="9"/><path d="M8 14q4 5 8 0M8 9h.1M16 9h.1"/>',
      voiceMessageButton: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M6 10v2a6 6 0 0 0 12 0v-2M12 18v4M9 22h6"/>',
      sendButton: '<path d="m4 3 17 9-17 9 4-9-4-9ZM8 12h13"/>',
      audioCallButton: '<path d="M5 3h4l2 5-3 2q2 4 6 6l2-3 5 2v4q0 2-3 2C10 20 4 14 3 6q0-3 2-3Z"/>',
      videoCallButton: '<rect x="3" y="6" width="12" height="12" rx="3"/><path d="m15 10 6-4v12l-6-4"/>',
      chatInfoButton: '<circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>'
    };
    for (const [id, path] of Object.entries(icons)) {
      const node = $(id);
      if (node) node.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">'.concat(path, "</svg>");
    }
    (_a11 = $("emojiButton")) == null ? void 0 : _a11.addEventListener("click", () => {
      const existing = document.querySelector(".emoji-picker");
      if (existing) {
        existing.remove();
        return;
      }
      const picker = document.createElement("div");
      picker.className = "emoji-picker";
      for (const emoji of ["\u{1F600}", "\u{1F602}", "\u2764\uFE0F", "\u{1F44D}", "\u{1F525}", "\u{1F60A}", "\u{1F970}", "\u{1F60E}", "\u{1F389}", "\u{1F622}", "\u{1F914}", "\u{1F64F}"]) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = emoji;
        button.onclick = () => {
          const input = ui.messageInput;
          input.setRangeText(emoji, input.selectionStart, input.selectionEnd, "end");
          input.dispatchEvent(new Event("input", { bubbles: true }));
          input.focus();
          picker.remove();
        };
        picker.append(button);
      }
      ui.activeChat.append(picker);
    });
    (_b = $("voiceMessageButton")) == null ? void 0 : _b.addEventListener("click", toggleVoiceMessage);
    window.addEventListener("pagehide", cancelVoiceRecording);
    const sync = () => {
      var _a12;
      document.documentElement.style.setProperty("--app-height", "".concat(Math.round(((_a12 = window.visualViewport) == null ? void 0 : _a12.height) || innerHeight), "px"));
    };
    sync();
    (_c = window.visualViewport) == null ? void 0 : _c.addEventListener("resize", sync);
    window.addEventListener("resize", sync);
  }
  setupMessengerUI();
  initNativeShell().catch(() => {
  });
  boot().catch(() => {
    ui.authView.classList.remove("hidden");
    ui.authError.textContent = t("serverError");
  });
})();
