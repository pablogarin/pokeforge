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
badd +20 pokeforge-front/src/pages/Lineup.tsx
badd +5 pokeforge-front/src/components/CurrentPokemon.tsx
badd +26 pokeforge-front/src/components/CurrentPokemon.css
badd +1 pokeforge-front/src/components/ActivePokemon.css
badd +12 pokeforge-front/src/components/ActivePokemon.tsx
badd +16 pokeforge-front/src/pages/Lineup.css
badd +20 pokeforge-front/src/components/PokeBall.css
badd +20 pokeforge-front/src/components/PokeBall.tsx
badd +23 pokeforge-front/src/types/pokemon.tsx
badd +78 pokeforge-db/migrations/001_init_all_systems.sql
badd +98 pokeforge-front/src/components/PokemonForm.tsx
badd +65 pokeforge-front/src/components/PokemonForm.css
badd +72 pokeforge-front/src/pages/Pokedex.tsx
badd +30 pokeforge-services/service-iv-calc/graphql_engine/mutations.py
badd +7 pokeforge-services/service-iv-calc/main.py
badd +1 pokeforge-services/service-iv-calc/graphql_engine/__init__.py
badd +27 pokeforge-front/src/hooks/useGraphQL.ts
badd +6 pokeforge-infra/docker-compose.yaml
badd +4 pokeforge-infra/.env
badd +7 pokeforge-services/service-iv-calc/config.py
badd +18 pokeforge-services/service-iv-calc/graphql_engine/graphql_context.py
argglobal
%argdel
edit pokeforge-services/service-iv-calc/graphql_engine/graphql_context.py
argglobal
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
let s:l = 19 - ((18 * winheight(0) + 14) / 28)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 19
normal! 09|
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
