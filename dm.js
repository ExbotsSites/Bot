@bot.command()
async def send_anon(ctx, user_id: int, *, messaggio: str):
    """Invia un DM a un utente usando l'ID, nascondendo chi sei."""
    try:
        # Cerca l'utente tramite ID
        target_user = await bot.fetch_user(user_id)
        
        # Crea un nome casuale per questa sessione
        nomi_fake = ["Agente Segreto", "Utente Anonimo", "Qualcuno", "Viandante"]
        fake_name = random.choice(nomi_fake)

        # Invia il messaggio
        embed = discord.Embed(
            title=f"Messaggio da: {fake_name}",
            description=messaggio,
            color=discord.Color.dark_gray()
        )
        await target_user.send(embed=embed)
        await ctx.send("Messaggio inviato in segreto!", delete_after=5)

    except Exception as e:
        await ctx.send(f"Errore: Non posso inviare il messaggio. L'utente potrebbe avere i DM chiusi.")
