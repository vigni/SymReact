<?php

namespace App\Doctrine;

use App\Entity\Invoice;
use App\Entity\Customer;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\Security\Core\Security;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryItemExtensionInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;

class CurrentUserExtension implements QueryCollectionExtensionInterface, QueryItemExtensionInterface
{

    private $security;
    private $auth;

    public function __construct(Security $security, AuthorizationCheckerInterface $auth)
    {
        $this->security = $security;
        $this->auth = $auth;
    }

    private function addWhere(QueryBuilder $queryBuilder,string $ressourceClass){
        $user = $this->security->getUser();

        if(($ressourceClass === Customer::class || $ressourceClass === Invoice::class) && !$this->auth->isGranted('ROLE_ADMIN')
        && $user instanceof User)
        {
            $rootAlias = $queryBuilder->getRootAliases()[0];
            
            if($ressourceClass === Customer::class){
                $queryBuilder->andWhere("$rootAlias.user = :user");
            }else if($ressourceClass === Invoice::class){
                $queryBuilder->join("$rootAlias.customer", "c")
                             ->andWhere("c.user = :user");
            }

            $queryBuilder->setParameter("user", $user);
        }
    }

    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator,
    string $ressourceClass, ?string $operationName = null)
    {
        $this->addWhere($queryBuilder, $ressourceClass);
    }

    public function applyToItem(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator,
    string $ressourceClass, array $identifiers, ?string $operationName = null, array $context = [])
    {
        $this->addWhere($queryBuilder, $ressourceClass);
    }
}