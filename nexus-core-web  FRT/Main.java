import java.util.ArrayList;
import java.util.List;

public class Main {

    public static void main(String[] args){

        List<Estudo> estudos = new ArrayList<>();

        estudos.add(new Estudo("Java",3));
        estudos.add(new Estudo("Python",2));
        estudos.add(new Estudo("SQL",1));

        Analytics analytics = new Analytics();

        int total = analytics.calcularHoras(estudos);

        System.out.println("Horas estudadas: " + total);

    }

}