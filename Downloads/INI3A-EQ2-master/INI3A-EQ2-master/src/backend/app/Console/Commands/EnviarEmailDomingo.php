<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use App\Models\User;

class EnviarEmailDomingo extends Command
{
    protected $signature = 'emails:enviar-domingo';
    protected $description = 'Envia e-mails automáticos todo domingo de manhã para os usuários.';

    public function handle()
    {
        $usuarios = User::all();

        foreach ($usuarios as $usuario) {
            $nome = $usuario->name;
            $email = $usuario->email;
            $link = 'https://flashminder.com/pagInicial/home'; 

            $assunto = 'Sua revisão semanal no Flashminder te espera!';
            $corpo = <<<EOT
Olá, {$nome},

Pronto para reforçar seu conhecimento?
Seus flashcards esperam você, prontos para serem revisados! Lembre-se, a revisão regular é a chave para a memorização a longo prazo.

📚 Por que revisar agora?

-Reforce o aprendizado: A cada revisão, as informações ficam mais fortes na sua memória.
-Economize tempo no futuro: Revisar um pouco agora evita que você esqueça tudo e tenha que recomeçar do zero depois.
-Mantenha seu progresso: Não deixe o conhecimento que você conquistou escorrer pelos dedos!

👉 [Começar minha revisão agora]({$link})

Se tiver alguma dúvida ou precisar de ajuda, estamos aqui para você.

Bons estudos!  
Abraços,  
Equipe Flashminder
EOT;

            Mail::raw($corpo, function ($message) use ($email, $assunto) {
                $message->to($email)->subject($assunto);
            });
        }

        $this->info('E-mails semanais enviados com sucesso!');
    }
}
