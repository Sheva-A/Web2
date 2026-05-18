"use strict";

const pokemonBtn = document.getElementById('loadPokemon');
const pokemonOutput = document.getElementById('pokemonOutput');

function processPokemonData(data) {
    return {
        name: data.name.toUpperCase(),
        img: data.sprites.front_default,
        hp: data.stats[0].base_stat,
        atk: data.stats[1].base_stat,
        def: data.stats[2].base_stat,
        speed: data.stats[5].base_stat,
        type: data.types[0].type.name,
        special: data.stats[3].base_stat
    };
}

async function getPokemonData() {
    const id = prompt("Введіть ім'я або ID покемона:");
    if (!id) return;

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id.toLowerCase()}`);

        if (!response.ok) {
            throw new Error("Покемона не знайдено!");
        }

        const data = await response.json();

        const pokemon = processPokemonData(data);

        pokemonOutput.innerHTML = `
            <div class="pokemon-card">
                <h2>${pokemon.name}</h2>
                <img src="${pokemon.img}" alt="pokemon">
                <div class="stats">
                    <p><b>Type:</b> ${pokemon.type}</p>
                    <p><b>HP:</b> ${pokemon.hp}</p>
                    <p><b>Attack:</b> ${pokemon.atk}</p>
                    <p><b>Defense:</b> ${pokemon.def}</p>
                    <p><b>Speed:</b> ${pokemon.speed}</p>
                    <p><b>Special:</b> ${pokemon.special}
                </div>
            </div>
        `;

    } catch (error) {
        pokemonOutput.innerHTML = `<p style="color: red;">${error.message}</p>`;
    }
}

pokemonBtn.addEventListener('click', getPokemonData);