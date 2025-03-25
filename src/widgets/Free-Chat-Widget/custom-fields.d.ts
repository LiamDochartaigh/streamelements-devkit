export {};

declare global {
  interface CustomFields {
    previewMode: 'true' | 'false';
    borderRoundness: 'straight' | 'soft' | 'round';
    borderThickness: number;
    glow: 'true' | 'false';
    borderStyle: 'simple' | 'detailed';
    chatStyle: 'box' | 'bubbles';
    bgOpacity: number;
    fontName: string;
    fontSize: number;
    messageFontWeight: '100' | '300' | '400' | '500' | '700' | '900';
    usernameFontWeight: '100' | '300' | '400' | '500' | '700' | '900';
    messageSpacing: number;
    hideCommands: boolean;
    mutedUsers: string;
    fadeMessages: boolean;
    hideMessage: number;
    widgetColor: string;
    detailColor: string;
    nameColor: string;
    messageColor: string;
    messageAnimation: boolean;
  }
  type ButtonTypes = 'hexeum_test_message' | 'send_new_btn'; 
}