export type Locale = "en" | "pt-BR";

const translations = {
  en: {
    // Sidebar
    "sidebar.title": "YT Manager",
    "sidebar.subtitle": "Content Calendar",
    "sidebar.menu": "Menu",
    "sidebar.calendar": "Calendar",
    "sidebar.calendar.desc": "Video schedule",
    "sidebar.channels": "Channels",
    "sidebar.channels.desc": "Manage channels",
    "sidebar.settings": "Settings",
    "sidebar.settings.desc": "Preferences",
    "sidebar.proTip": "Pro tip",
    "sidebar.proTipText": "Add channels in Settings, then hit Sync to fetch videos.",

    // Calendar
    "calendar.today": "Today",
    "calendar.week": "Week",
    "calendar.month": "Month",
    "calendar.channel": "Channel",
    "calendar.needsVideo": "Needs video",
    "calendar.slotAvailable": "Slot available",
    "calendar.missed": "Missed",
    "calendar.noVideoPosted": "No video posted",
    "calendar.noChannels": "No channels yet",
    "calendar.noChannelsHint": "Go to Settings to add your YouTube channels.",

    // Video detail modal
    "modal.save": "Save",
    "modal.cancel": "Cancel",
    "modal.views": "views",
    "modal.likes": "likes",
    "modal.comments": "comments",
    "modal.watchOnYouTube": "Watch on YouTube",

    // Channels page
    "channels.title": "Channels",
    "channels.subtitle": "Manage the YouTube channels you want to track.",
    "channels.noChannels": "No channels yet",
    "channels.noChannelsHint": "Add a channel above to get started.",

    // Channel card
    "channel.goal": "Goal",
    "channel.perDay": "/day",
    "channel.subscribers": "subscribers",

    // Add channel form
    "channel.placeholder": "Channel ID, @handle, or YouTube URL...",
    "channel.add": "Add",
    "channel.addError": "Failed to add channel",
    "channel.needsOAuth": "Google account not connected yet",
    "channel.needsOAuthHint": "Connect your Google account first so the app can fetch channel data.",
    "channel.goToSettings": "Go to Settings",

    // Sync
    "sync.sync": "Sync",
    "sync.syncing": "Syncing...",
    "sync.done": "Done!",

    // Settings
    "settings.title": "Settings",
    "settings.subtitle": "Configure your YouTube Manager preferences.",
    "settings.language": "Language",
    "settings.languageLabel": "Interface language",
    "settings.languageHint": "All texts in the interface will be displayed in this language.",
    "settings.timezone": "Timezone",
    "settings.displayTimesIn": "Display times in",
    "settings.timezoneHint": "All video publish times will be shown in this timezone.",
    "settings.addChannel": "Add Channel",
    "settings.howToAdd": "How to add channels",
    "settings.howToAddDetail":
      "Use channel ID (UC...), @handle, or full YouTube URL. After adding, click Sync in the header to fetch videos.",
    "settings.yourChannels": "Your Channels",
    "settings.channelGoalHint": "Set the daily video goal per channel. Missing slots show up on the calendar.",
    "settings.syncStatus": "Sync Status",
    "settings.neverSynced": "Never synced",
    "settings.syncHint": "Click Sync in the header to fetch latest videos.",
    "settings.youtubeAccount": "YouTube Account",
    "settings.connectGoogle": "Connect with Google",
    "settings.connectedAs": "Connected as",
    "settings.notConnected": "Not connected",
    "settings.oauthHint": "Connect your Google account to see scheduled and private videos.",
    "settings.oauthExpired": "Token expired. Please reconnect.",
    "settings.oauthNotConfigured": "Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local to enable.",
    "settings.oauthSuccess": "Google account connected successfully!",
    "settings.oauthError": "Failed to connect Google account.",
    "settings.disconnect": "Disconnect",
    "settings.reconnect": "Reconnect",
    "settings.brandAccountTip": "Rename your brand accounts at",
    "calendar.scheduled": "Scheduled",
  },
  "pt-BR": {
    // Sidebar
    "sidebar.title": "YT Manager",
    "sidebar.subtitle": "Calendário de Vídeos",
    "sidebar.menu": "Menu",
    "sidebar.calendar": "Calendário",
    "sidebar.calendar.desc": "Agenda de vídeos",
    "sidebar.channels": "Canais",
    "sidebar.channels.desc": "Gerenciar canais",
    "sidebar.settings": "Configurações",
    "sidebar.settings.desc": "Preferências",
    "sidebar.proTip": "Dica",
    "sidebar.proTipText": "Adicione canais em Configurações e clique em Sincronizar para buscar vídeos.",

    // Calendar
    "calendar.today": "Hoje",
    "calendar.week": "Semana",
    "calendar.month": "Mês",
    "calendar.channel": "Canal",
    "calendar.needsVideo": "Precisa de vídeo",
    "calendar.slotAvailable": "Vaga disponível",
    "calendar.missed": "Perdido",
    "calendar.noVideoPosted": "Nenhum vídeo publicado",
    "calendar.noChannels": "Nenhum canal ainda",
    "calendar.noChannelsHint": "Vá em Configurações para adicionar seus canais do YouTube.",

    // Video detail modal
    "modal.save": "Salvar",
    "modal.cancel": "Cancelar",
    "modal.views": "visualizações",
    "modal.likes": "curtidas",
    "modal.comments": "comentários",
    "modal.watchOnYouTube": "Assistir no YouTube",

    // Channels page
    "channels.title": "Canais",
    "channels.subtitle": "Gerencie os canais do YouTube que você deseja acompanhar.",
    "channels.noChannels": "Nenhum canal ainda",
    "channels.noChannelsHint": "Adicione um canal acima para começar.",

    // Channel card
    "channel.goal": "Meta",
    "channel.perDay": "/dia",
    "channel.subscribers": "inscritos",

    // Add channel form
    "channel.placeholder": "ID do canal, @handle ou URL do YouTube...",
    "channel.add": "Adicionar",
    "channel.addError": "Falha ao adicionar canal",
    "channel.needsOAuth": "Conta Google ainda não conectada",
    "channel.needsOAuthHint": "Conecte sua conta Google primeiro para o app buscar os dados do canal.",
    "channel.goToSettings": "Ir para Configurações",

    // Sync
    "sync.sync": "Sincronizar",
    "sync.syncing": "Sincronizando...",
    "sync.done": "Pronto!",

    // Settings
    "settings.title": "Configurações",
    "settings.subtitle": "Configure suas preferências do YouTube Manager.",
    "settings.language": "Idioma",
    "settings.languageLabel": "Idioma da interface",
    "settings.languageHint": "Todos os textos da interface serão exibidos neste idioma.",
    "settings.timezone": "Fuso horário",
    "settings.displayTimesIn": "Exibir horários em",
    "settings.timezoneHint": "Todos os horários de publicação serão exibidos neste fuso.",
    "settings.addChannel": "Adicionar Canal",
    "settings.howToAdd": "Como adicionar canais",
    "settings.howToAddDetail":
      "Use o ID do canal (UC...), @handle ou URL completa do YouTube. Após adicionar, clique em Sincronizar no cabeçalho para buscar os vídeos.",
    "settings.yourChannels": "Seus Canais",
    "settings.channelGoalHint": "Defina a meta diária de vídeos por canal. Vagas faltantes aparecem no calendário.",
    "settings.syncStatus": "Status da Sincronização",
    "settings.neverSynced": "Nunca sincronizado",
    "settings.syncHint": "Clique em Sincronizar no cabeçalho para buscar os vídeos mais recentes.",
    "settings.youtubeAccount": "Conta YouTube",
    "settings.connectGoogle": "Conectar com Google",
    "settings.connectedAs": "Conectado como",
    "settings.notConnected": "Não conectado",
    "settings.oauthHint": "Conecte sua conta Google para ver vídeos agendados e privados.",
    "settings.oauthExpired": "Token expirado. Reconecte sua conta.",
    "settings.oauthNotConfigured": "Configure GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET no .env.local para ativar.",
    "settings.oauthSuccess": "Conta Google conectada com sucesso!",
    "settings.oauthError": "Falha ao conectar conta Google.",
    "settings.disconnect": "Desconectar",
    "settings.reconnect": "Reconectar",
    "settings.brandAccountTip": "Renomeie suas contas de marca em",
    "calendar.scheduled": "Agendado",
  },
} as const;

export type TranslationKey = keyof (typeof translations)["en"];

export function t(locale: Locale, key: TranslationKey): string {
  return translations[locale][key] ?? translations.en[key] ?? key;
}

export const DAYS_OF_WEEK: Record<Locale, string[]> = {
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  "pt-BR": ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
};
