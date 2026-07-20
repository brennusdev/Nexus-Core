import java.util.List;

public class Analytics {

    public int calcularHoras(List<Estudo> estudos){

        int total = 0;

        for(Estudo estudo : estudos){

            total += estudo.getHoras();

        }

        return total;

    }

}