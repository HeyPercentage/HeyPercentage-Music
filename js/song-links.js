// ==========================================================
// DIRECT STREAMING LINKS (one entry per song on songs.html)
// ----------------------------------------------------------
// Paste the song's direct link for each platform between the quotes.
// Leave a platform empty ('') and it simply won't appear for that song.
// The key must match the data-key on the song's .song-item in songs.html.
// Songs with no direct links yet still work: they use the push.fm link.
// ==========================================================

const PLATFORMS = [
    { id: 'spotify', label: 'Spotify' },
    { id: 'apple',   label: 'Apple Music' },
    { id: 'ytmusic', label: 'YouTube Music' },
    { id: 'amazon',  label: 'Amazon Music' },
    { id: 'tidal',   label: 'Tidal' },
];

const SONG_LINKS = {
    'still-hyper': { 
        spotify: 'https://open.spotify.com/album/6j6cy7yI7sJOb192lsKRNd', 
        apple: 'https://music.apple.com/us/album/still-hyper/1831394006', 
        ytmusic: 'https://music.youtube.com/playlist?list=OLAK5uy_ktykt0NDeOMVmL0j4KmO_ykkEYQVkiqtI&si=yRAEyKC7RA6Ff9St&drli=1', 
        tidal: 'https://tidal.com/album/452298222/u' },

    'intentions': { 
        spotify: 'https://open.spotify.com/album/5WS6WQVxw7cw4ClgLXdjxb', 
        apple: 'https://music.apple.com/us/album/intentions-single/1843945139', 
        ytmusic: 'https://music.youtube.com/playlist?list=OLAK5uy_lIAvzA3jVfO4u5Fbd1G-LOB4IWtUWk0ZU&si=EsgJ5rZvveN0JWp6&drli=1', 
        tidal: 'https://tidal.com/album/464433655/u' },

    'still-chose-you': { 
        spotify: 'https://open.spotify.com/album/72uYe66ot6LJ6Id3TnEja6', 
        apple: 'https://music.apple.com/us/album/still-chose-you-ep-ep/1884263011', 
        ytmusic: 'https://music.youtube.com/playlist?list=OLAK5uy_lSZBaDi5YLjzfnJtr53ej29BmGCvOo5Pk&si=ZP67kSJahG0_5IoF&drli=1', 
        amazon: 'https://music.amazon.com/albums/B0GRX918M5?marketplaceId=ATVPDKIKX0DER&musicTerritory=US&ref=dm_sh_duqlfI4JgTsBHTBWgbQNIt94w', 
        tidal: 'https://tidal.com/album/508588893/u' },

    'its-you': { 
        spotify: 'https://open.spotify.com/album/6KXcqe0CaFsmUCa3hnOZny', 
        apple: 'https://music.apple.com/us/album/its-you-single/1889242616', 
        ytmusic: 'https://music.youtube.com/playlist?list=OLAK5uy_ls237iEjEjsnZqg_U-mU0LvRdhhgnhCPM&si=ClM6eX3RCvN_Ka8D&drli=1', 
        tidal: 'https://tidal.com/album/510626119/u' },

    'quebra-quebra': { 
        spotify: 'https://open.spotify.com/album/140SRYPI5OzqSbtsks4mJP', 
        apple: 'https://music.apple.com/us/album/quebra-quebra-single/1891395998', 
        ytmusic: 'https://music.youtube.com/playlist?list=OLAK5uy_nyC_QR9AHdZlskY8w99r7cDtJJd-tlz3w&si=HitHleAj_VNcuGEg&drli=1', 
        amazon: 'https://music.amazon.com/albums/B0H1PQDGDX?marketplaceId=ATVPDKIKX0DER&musicTerritory=US&ref=dm_sh_OHk1wbzUYSPycyynQ61Aq4hZE', 
        tidal: 'https://tidal.com/album/513848184/u' },

    'on-my-way': { 
        spotify: 'https://open.spotify.com/album/1n4xYMwy8e6LF4WT68liXb', 
        apple: 'https://music.apple.com/us/album/on-my-way-single/1895941848', 
        ytmusic: 'https://music.youtube.com/playlist?list=OLAK5uy_mch4ddySIYs4_ZbuTokJEGMPFV41XlYo8&si=CpFLYewr66qvsXdr&drli=1', 
        tidal: 'https://tidal.com/album/520365863/u' },

    'her-smile': { 
        spotify: 'https://open.spotify.com/album/0IO3sAyJocdw4pAvo13adO', 
        apple: 'https://music.apple.com/us/album/her-smile-single/1895962077', 
        ytmusic: 'https://music.youtube.com/playlist?list=OLAK5uy_mzfy_EbtruDCEs4z8ERrGZHA01-XJhawc&si=ZLJFdWHYAoeCGktO&drli=1', 
        amazon: '', 
        tidal: 'https://tidal.com/album/520365979/u' },

    'where-i-belong': { 
        spotify: 'https://open.spotify.com/album/2LJmACgnkUzRA0KfEprOMc', 
        apple: 'https://music.apple.com/us/album/where-i-belong-feat-luvarzy-single/1893629729', 
        ytmusic: 'https://music.youtube.com/playlist?list=OLAK5uy_nddS5bVRFM59eRdU52mU5wBXutnVQd1pg&si=kmS8TZJbJAA97aaI&drli=1', 
        tidal: 'https://tidal.com/album/515782143/u' },

    'your-feelings': { 
        spotify: 'https://open.spotify.com/album/6wOcYCOYatyCY99Cn7MgBZ', 
        apple: 'https://music.apple.com/us/album/your-feelings-single/1854158316', 
        ytmusic: 'https://music.youtube.com/playlist?list=OLAK5uy_kVrQc6pPPTNaKlvcr6n3eubcAJ0CDXlhk&si=Z38zc0DUq7-oxY9f&drli=1', 
        tidal: 'https://tidal.com/album/475184399/u' },

    'kingdom': { 
        spotify: 'https://open.spotify.com/album/5AL08TSHBNs5Q5Ru6DmZIs', 
        apple: 'https://music.apple.com/us/album/kingdom/1833971496', 
        ytmusic: 'https://music.youtube.com/playlist?list=OLAK5uy_nr25vv5beus-jnvBNE8Y6HTdneZffYqOM&si=d8VwinG8IeOP_wQp&drli=1', 
        amazon: 'https://music.amazon.com/albums/B0FMS3HR75?marketplaceId=ATVPDKIKX0DER&musicTerritory=US&ref=dm_sh_bl4I60r9r9wI6gc3WSnRNFePW', 
        tidal: 'https://tidal.com/album/454819650/u' },

    'starwalkin': { 
        spotify: 'https://open.spotify.com/album/34QlGhh2OaTKpxYotubcum', 
        apple: 'https://music.apple.com/us/album/starwalkin-single/1824313153', 
        ytmusic: 'https://music.youtube.com/playlist?list=OLAK5uy_mRZ2upYb3CRIA5x0B3L5Mzx5PUd3zWZsI&si=zycFSdmjLCuXwX9O&drli=1', 
        amazon: 'https://music.amazon.com/albums/B0FGKGDP32?marketplaceId=ATVPDKIKX0DER&musicTerritory=US&ref=dm_sh_hj9MFPBNqXexp7y5bHy8aIyDE', 
        tidal: 'https://tidal.com/album/445620646/u' },

    'karma': { 
        spotify: 'https://open.spotify.com/album/5gr83Wc4KxyJXsYO1AsPxq', 
        apple: 'https://music.apple.com/us/album/karma-single/1816083401', 
        ytmusic: 'https://music.youtube.com/playlist?list=OLAK5uy_nXqwxR4_I-V4rSzTtVTpAcuRGohXeRB7k&si=IprnYQNGIltAYPG6&drli=1', 
        amazon: '', 
        tidal: 'https://tidal.com/album/437477580/u' },

    'gemstone': { 
        spotify: 'https://open.spotify.com/album/6UrPF3s3LXzQVUBwp1akqy', 
        apple: 'https://music.apple.com/us/album/gemstone-feat-sneaky-rapper-kid-42-single/1821327313', 
        ytmusic: 'https://music.youtube.com/playlist?list=OLAK5uy_mSQRkZN_pZkl2NGmJf-jJITt5FPjQE6h0&si=_UYrmDscw_5-k628&drli=1', 
        amazon: '', 
        tidal: 'https://tidal.com/album/442674776/u' },

    'drilltopia': { 
        spotify: 'https://open.spotify.com/album/7pNnJy4A74HrBtkR0w8V0K', 
        apple: 'https://music.apple.com/us/album/drilltopia/1808700007', 
        ytmusic: 'https://music.youtube.com/playlist?list=OLAK5uy_mW_4GcHMzfF8A8UKVeNXAOGn_ubnIVfC0&si=qlf7JoAGePcjv9q1&drli=1', 
        amazon: '', 
        tidal: 'https://tidal.com/album/430194991/u' },

    'feelings-change': { 
        spotify: 'https://open.spotify.com/album/6nZRGmr7Y1MEtMoDklI4HF', 
        apple: 'https://music.apple.com/us/album/feelings-change-og-single/1795136672', 
        ytmusic: 'https://music.youtube.com/playlist?list=OLAK5uy_mW_4GcHMzfF8A8UKVeNXAOGn_ubnIVfC0&si=qlf7JoAGePcjv9q1&drli=1', 
        amazon: '', 
        tidal: 'https://tidal.com/album/416454988/u' },

    'shockwave': { 
        spotify: 'https://open.spotify.com/album/7cl8ssustLexD2wr5LFLeC', 
        apple: 'https://music.apple.com/us/album/shockwave-single/1798538847', 
        ytmusic: 'https://music.youtube.com/playlist?list=OLAK5uy_nnxevEpBXshXCxfjaVWZ4-YxoH9RczCZU&si=lAGuS8lRTtgATHLV&drli=1', 
        amazon: '', 
        tidal: 'https://tidal.com/album/420143587/u' },

    'emotionally-attached': { 
        spotify: 'https://open.spotify.com/album/1KXzOidW6LSvXXvh3fH0Tj', 
        apple: 'https://music.apple.com/us/album/emotionally-attached-single/1883041524', 
        ytmusic: 'https://music.youtube.com/playlist?list=OLAK5uy_kJkG7n6kXjROepiSBbCXkiNeZ6tIe0mPA&si=2cq-ldTenTTi-jkK&drli=1', 
        amazon: '', 
        tidal: 'https://tidal.com/album/508580459/u' },

    'how-you-feel': { 
        spotify: 'https://open.spotify.com/album/1pNgxkazFLWVTAHOulCGIK', 
        apple: 'https://music.apple.com/us/album/how-you-feel-single/1842892651', 
        ytmusic: 'https://music.youtube.com/playlist?list=OLAK5uy_lqWMVjn_udQEQWc2c4-tf4N_HDaXqg060&si=K9IsFGGtqu9pWfYJ&drli=1', 
        amazon: 'https://music.amazon.com/albums/B0FT9SL8ZV?marketplaceId=ATVPDKIKX0DER&musicTerritory=US&ref=dm_sh_gofCRJdpc28wTlXrkxseyZ6lk', 
        tidal: 'https://tidal.com/album/463643455/u' },

    'twilight': { 
        spotify: 'https://open.spotify.com/album/5vGE0XFfBwb7YRhNSBuYf5', 
        apple: 'https://music.apple.com/us/album/twilight-single/1895821685', 
        ytmusic: 'https://music.youtube.com/playlist?list=OLAK5uy_l6Ruizusazvzx1qs9jWZN9lYJ3NaLA9MU&si=lxEtxCeUKoSk7crx&drli=1', 
        amazon: 'https://music.amazon.com/albums/B0GYZTX9K4?marketplaceId=ATVPDKIKX0DER&musicTerritory=US&ref=dm_sh_FXZh1PMLHxS8vGtWs4QtibX7q', 
        tidal: 'https://tidal.com/album/520068684/u' },

    'trust-issues': { 
        spotify: 'https://open.spotify.com/album/1eahnHKf4y4BEFmLwCv83s', 
        apple: 'https://music.apple.com/us/album/trust-issues-single/6771884930', 
        ytmusic: 'https://music.youtube.com/playlist?list=OLAK5uy_lDtC1JNk615j3vRXBEEcIBQpE9gfBZ4bc&si=1dhPXz6FXwLM2Cyn&drli=1', 
        amazon: 'https://music.amazon.com/albums/B0H2NDXXR9?marketplaceId=ATVPDKIKX0DER&musicTerritory=US&ref=dm_sh_Po9lmtYqJQ2qRFRrBjekkUa7Y', 
        tidal: 'https://tidal.com/album/526889460/u' },

    'obsession': { 
        spotify: 'https://open.spotify.com/album/0Nwd2bxtzyD2VSgv2fszzv', 
        apple: 'https://music.apple.com/us/album/obsession-single/6795260287', 
        ytmusic: 'https://music.youtube.com/watch?v=I6x2dJLHp9Y&drli=1', 
        amazon: 'https://music.amazon.com/albums/B0HBRN3J79?marketplaceId=ATVPDKIKX0DER&musicTerritory=US&ref=dm_sh_MD9l1YDApv337rjDPmbbViwAT', 
        tidal: 'https://tidal.com/album/546868992/u' },

    'vacation': { 
        spotify: 'https://open.spotify.com/album/3AcLorCVa4z0EL6951uoJZ', 
        apple: 'https://music.apple.com/us/album/vacation-single/6792989130', 
        ytmusic: 'https://music.youtube.com/playlist?list=OLAK5uy_krIMF7A-ofYgMzJCCizHzbE6I75SEccWw&si=wL9_KlJEsWCilBkn&drli=1', 
        amazon: 'https://music.amazon.com/albums/B0H9QZNHDL?marketplaceId=ATVPDKIKX0DER&musicTerritory=US&ref=dm_sh_oPDld6JueQO8FLIVVpfLZoYmC', 
        tidal: 'https://tidal.com/album/544988474/u' },

    'suara-hatiku': { 
        spotify: 'https://open.spotify.com/album/2UvRvYrG3ZqDAUi8MuA39l', 
        apple: 'https://music.apple.com/us/album/suara-hatiku-single/6807324153', 
        ytmusic: 'https://music.youtube.com/watch?v=vbCKmJqsJWE&drli=1', 
        amazon: 'https://music.amazon.com/albums/B0HHDMR13Q?marketplaceId=ATVPDKIKX0DER&musicTerritory=US&ref=dm_sh_8uVPlKwh8pnIqIf64TX79xOcl', 
        tidal: 'https://tidal.com/album/557335382/u' },

    'another-day-in-paradise': { 
        spotify: 'https://open.spotify.com/album/0KTn71tyqdGYTt0kJhcaDo', 
        apple: 'https://music.apple.com/us/album/another-day-in-paradise-single/6818352381', 
        ytmusic: 'https://music.youtube.com/playlist?list=OLAK5uy_l9JaiLPftgBC0WEY0hC2QhTcfqgiZbpsI&si=nH-xqLUn1-SK7MKA&drli=1', 
        amazon: 'https://music.amazon.com/albums/B0HLRS1W9X?marketplaceId=ATVPDKIKX0DER&musicTerritory=US&ref=dm_sh_wlDOHvjlbBMKRfpSxMOIk6jw0', 
        tidal: 'https://tidal.com/album/566403555/u' },

    'peace-of-mind': { 
        spotify: 'https://open.spotify.com/album/2eErfR0qIpSpx8zYZ2GMBm', 
        apple: 'https://music.apple.com/us/album/peace-of-mind-single/6825111810', 
        ytmusic: 'https://music.youtube.com/playlist?list=OLAK5uy_mCUz2x8NS-WSDIO4-WGGo9G8tf8Y40MXc&si=SS8ruQjvsM_kR49E&drli=1', 
        amazon: 'https://music.amazon.com/albums/B0HNRLFQZH?marketplaceId=ATVPDKIKX0DER&musicTerritory=US&ref=dm_sh_Rz18MsMdQGdYw2luszBd8YYrv', 
        tidal: 'https://tidal.com/album/571687859/u' },

    'take-me-home': { 
        spotify: '', 
        apple: '', 
        ytmusic: '', 
        amazon: '', 
        tidal: '' },

    'percudie': { 
        spotify: '', 
        apple: '', 
        ytmusic: '', 
        amazon: '', 
        tidal: '' }      
};
