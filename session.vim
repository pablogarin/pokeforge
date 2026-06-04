let SessionLoad = 1
let s:so_save = &g:so | let s:siso_save = &g:siso | setg so=0 siso=0 | setl so=-1 siso=-1
let v:this_session=expand("<sfile>:p")
silent only
silent tabonly
cd ~/node/pokeforge
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
let s:shortmess_save = &shortmess
if &shortmess =~ 'A'
  set shortmess=aoOA
else
  set shortmess=aoO
endif
badd +7 pokeforge-front/package.json
badd +5 pokeforge-front/src/index.css
badd +17 pokeforge-front/src/App.tsx
badd +6 pokeforge-front/src/main.tsx
badd +35 pokeforge-front/src/context/AuthContext.tsx
badd +23 pokeforge-front/src/pages/Login.tsx
badd +14 pokeforge-front/src/hooks/useGraphQL.ts
badd +4 pokeforge-front/tailwind.config.js
badd +32 pokeforge-front/src/components/header.tsx
badd +27 pokeforge-services/service-iv-calc/graphql_engine/types.py
badd +8 pokeforge-front/src/pages/Rooster.tsx
badd +79 pokeforge-front/src/pages/Pokedex.tsx
badd +1 pokeforge-front/src/pages/IVCalculator.tsx
badd +7 pokeforge-front/src/types/navigation.tsx
badd +1 pokeforge-front/src/util/pokemon.tsx
badd +8 pokeforge-front/src/components/PokemonImg.tsx
argglobal
%argdel
edit pokeforge-front/src/index.css
argglobal
balt pokeforge-front/src/pages/Pokedex.tsx
setlocal foldmethod=manual
setlocal foldexpr=0
setlocal foldmarker={{{,}}}
setlocal foldignore=#
setlocal foldlevel=0
setlocal foldminlines=1
setlocal foldnestmax=20
setlocal foldenable
silent! normal! zE
let &fdl = &fdl
let s:l = 5 - ((4 * winheight(0) + 13) / 27)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 5
normal! 084|
lcd ~/node/pokeforge
tabnext 1
if exists('s:wipebuf') && len(win_findbuf(s:wipebuf)) == 0 && getbufvar(s:wipebuf, '&buftype') isnot# 'terminal'
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20
let &shortmess = s:shortmess_save
let s:sx = expand("<sfile>:p:r")."x.vim"
if filereadable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &g:so = s:so_save | let &g:siso = s:siso_save
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
