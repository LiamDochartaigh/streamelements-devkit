export {};

declare global {
  const previewMode: 'true' | 'false';
  const borderRoundness: 'straight' | 'soft' | 'round';
  const borderThickness: number;
  const glow: 'true' | 'false';
  const borderStyle: 'simple' | 'detailed';
  const chatStyle: 'box' | 'bubbles';
  const bgOpacity: number;
  const fontName: string;
  const fontSize: number;
  const messageFontWeight: '100' | '300' | '400' | '500' | '700' | '900';
  const usernameFontWeight: '100' | '300' | '400' | '500' | '700' | '900';
  const messageSpacing: number;
  const hideCommands: boolean;
  const mutedUsers: string;
  const fadeMessages: boolean;
  const hideMessage: number;
  const widgetColor: string;
  const detailColor: string;
  const nameColor: string;
  const messageColor: string;
  const messageAnimation: boolean;
}